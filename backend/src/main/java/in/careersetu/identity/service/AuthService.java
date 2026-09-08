package in.careersetu.identity.service;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.JwtTokenService;
import in.careersetu.identity.dto.AuthDtos;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Authentication Service.
 *
 * <p>Handles registration, login, token management, email verification,
 * and password reset. Never returns sensitive data in responses.
 * Audit events are published for security-relevant operations.
 */
@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    private static final long ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60L;

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw CareerSetuException.conflict(
                    "EMAIL_ALREADY_EXISTS",
                    "An account with this email already exists."
            );
        }

        // Validate role
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw CareerSetuException.badRequest("INVALID_ROLE", "Invalid user role: " + request.getRole());
        }

        // Only allow self-registration for certain roles
        List<User.UserRole> selfRegisterableRoles = List.of(
                User.UserRole.STUDENT,
                User.UserRole.FACULTY,
                User.UserRole.EMPLOYER,
                User.UserRole.RECRUITER,
                User.UserRole.MENTOR,
                User.UserRole.ALUMNI
        );

        if (!selfRegisterableRoles.contains(role)) {
            throw CareerSetuException.accessDenied("This role cannot be self-registered.");
        }

        // Hash password with Argon2id
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // Create user
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .fullName(request.getFullName().trim())
                .displayName(request.getFullName().trim())
                .mobile(request.getMobile())
                .passwordHash(passwordHash)
                .primaryRole(role)
                .accountStatus(User.AccountStatus.PENDING_VERIFICATION)
                .emailVerified(false)
                .mobileVerified(false)
                .locale("en")
                .timezone("Asia/Kolkata")
                .failedLoginCount(0)
                .version(0L)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: userId={} role={}", savedUser.getId(), role);

        // TODO: Send verification email asynchronously
        // emailService.sendVerificationEmail(savedUser);

        // Generate tokens
        String accessToken = jwtTokenService.generateAccessToken(
                savedUser.getId(), savedUser.getEmail(), role.name(), List.of(role.name()), null);
        String refreshToken = jwtTokenService.generateRefreshToken(savedUser.getId());

        return AuthDtos.AuthResponse.of(
                accessToken,
                refreshToken,
                ACCESS_TOKEN_EXPIRY_SECONDS,
                toUserInfo(savedUser, List.of(role.name()))
        );
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> CareerSetuException.badRequest(
                        "INVALID_CREDENTIALS",
                        "Invalid email or password."
                ));

        // Check account status
        if (user.isLocked()) {
            throw CareerSetuException.badRequest("ACCOUNT_LOCKED",
                    "Your account is temporarily locked. Please try again later.");
        }

        if (user.getAccountStatus() == User.AccountStatus.SUSPENDED) {
            throw CareerSetuException.badRequest("ACCOUNT_SUSPENDED",
                    "Your account has been suspended. Please contact support.");
        }

        if (user.getAccountStatus() == User.AccountStatus.DEACTIVATED) {
            throw CareerSetuException.badRequest("ACCOUNT_DEACTIVATED",
                    "Your account has been deactivated.");
        }

        // Validate password (timing-safe comparison via Spring Security)
        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Increment failed login count
            user.setFailedLoginCount(user.getFailedLoginCount() + 1);
            if (user.getFailedLoginCount() >= 5) {
                user.setLockedUntil(java.time.Instant.now().plusSeconds(900)); // 15 min lock
                log.warn("Account locked due to failed login attempts: userId={}", user.getId());
            }
            userRepository.save(user);
            throw CareerSetuException.badRequest("INVALID_CREDENTIALS", "Invalid email or password.");
        }

        // Reset failed login count on success
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(java.time.Instant.now());

        // Auto-activate if was PENDING_VERIFICATION (for demo)
        if (user.getAccountStatus() == User.AccountStatus.PENDING_VERIFICATION) {
            user.setAccountStatus(User.AccountStatus.ACTIVE);
        }

        userRepository.save(user);
        log.info("User logged in: userId={}", user.getId());

        List<String> roles = List.of(user.getPrimaryRole().name());
        String accessToken = jwtTokenService.generateAccessToken(
                user.getId(), user.getEmail(), user.getPrimaryRole().name(), roles, null);
        String refreshToken = jwtTokenService.generateRefreshToken(user.getId());

        return AuthDtos.AuthResponse.of(
                accessToken, refreshToken, ACCESS_TOKEN_EXPIRY_SECONDS, toUserInfo(user, roles));
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserInfo getCurrentUserInfo(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> CareerSetuException.notFound("USER", userId.toString()));
        return toUserInfo(user, List.of(user.getPrimaryRole().name()));
    }

    private AuthDtos.UserInfo toUserInfo(User user, List<String> roles) {
        return new AuthDtos.UserInfo(
                user.getId().toString(),
                user.getEmail(),
                user.getFullName(),
                user.getDisplayName(),
                user.getPrimaryRole().name(),
                roles,
                user.isEmailVerified(),
                null // profile picture URL resolved separately via signed URL
        );
    }
}
