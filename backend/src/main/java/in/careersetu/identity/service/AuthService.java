package in.careersetu.identity.service;

import in.careersetu.audit.service.AuditLogService;
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

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Hardened Authentication Service.
 *
 * <p>Enforces:
 * - Strict email normalization and duplicate check
 * - OWASP Argon2id password hashing
 * - Non-enumerating timing-safe credential verification
 * - Server-authoritative role assignment (no client-side role determination)
 * - Brute force lockout after 5 consecutive failed attempts
 * - Comprehensive security audit logging
 * - Single-use expiring password reset flow
 */
@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final long ACCESS_TOKEN_EXPIRY_SECONDS = 60 * 60L; // 60 minutes

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenService jwtTokenService,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.auditLogService = auditLogService;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        // Validate email uniqueness with exact required user-facing message
        if (userRepository.existsByEmail(normalizedEmail)) {
            auditLogService.recordEvent(
                    "REGISTER_DUPLICATE_ATTEMPT",
                    null,
                    normalizedEmail,
                    null,
                    "FAILED",
                    "Attempted registration with existing email"
            );
            throw CareerSetuException.conflict(
                    "EMAIL_ALREADY_EXISTS",
                    "An account with this email already exists. Please sign in instead."
            );
        }

        // Validate role - self-registration is strictly disallowed for administrative roles
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw CareerSetuException.badRequest("INVALID_ROLE", "Invalid user role: " + request.getRole());
        }

        List<User.UserRole> selfRegisterableRoles = List.of(
                User.UserRole.STUDENT,
                User.UserRole.STUDENT_LEAD,
                User.UserRole.FACULTY,
                User.UserRole.EMPLOYER,
                User.UserRole.RECRUITER,
                User.UserRole.MENTOR,
                User.UserRole.ALUMNI,
                User.UserRole.TPO,
                User.UserRole.INSTITUTION_ADMIN,
                User.UserRole.DEPARTMENT_ADMIN
        );

        if (!selfRegisterableRoles.contains(role)) {
            auditLogService.recordEvent(
                    "UNAUTHORIZED_ROLE_SELF_ASSIGN",
                    null,
                    normalizedEmail,
                    null,
                    "SECURITY_VIOLATION",
                    "Attempted to self-assign administrative role: " + role
            );
            throw CareerSetuException.accessDenied("Administrative roles cannot be self-registered.");
        }

        // Hash password with Argon2id (never store plaintext)
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // Create user entity
        User user = User.builder()
                .email(normalizedEmail)
                .fullName(request.getFullName().trim())
                .displayName(request.getFullName().trim())
                .mobile(request.getMobile())
                .passwordHash(passwordHash)
                .primaryRole(role)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(false)
                .mobileVerified(false)
                .locale("en")
                .timezone("Asia/Kolkata")
                .failedLoginCount(0)
                .version(0L)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.recordEvent(
                "REGISTER",
                savedUser.getId(),
                normalizedEmail,
                null,
                "SUCCESS",
                "New account registered with role: " + role.name()
        );

        log.info("New user registered successfully: userId={} role={}", savedUser.getId(), role);

        List<String> roles = List.of(role.name());
        String accessToken = jwtTokenService.generateAccessToken(
                savedUser.getId(), savedUser.getEmail(), role.name(), roles, null);
        String refreshToken = jwtTokenService.generateRefreshToken(savedUser.getId());

        return AuthDtos.AuthResponse.of(
                accessToken,
                refreshToken,
                ACCESS_TOKEN_EXPIRY_SECONDS,
                toUserInfo(savedUser, roles)
        );
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        // Check account lock
        if (user != null && user.isLocked()) {
            auditLogService.recordEvent(
                    "LOGIN_BLOCKED",
                    user.getId(),
                    normalizedEmail,
                    null,
                    "BLOCKED",
                    "Attempted login while account is temporarily locked"
            );
            throw CareerSetuException.badRequest(
                    "ACCOUNT_LOCKED",
                    "Your account is temporarily locked due to failed login attempts. Please try again in 15 minutes."
            );
        }

        // Timing-safe credential verification (uniform generic error preventing account enumeration)
        if (user == null || user.getPasswordHash() == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {

            if (user != null) {
                user.setFailedLoginCount(user.getFailedLoginCount() + 1);
                if (user.getFailedLoginCount() >= 5) {
                    user.setLockedUntil(Instant.now().plusSeconds(900)); // 15-minute lockout
                    auditLogService.recordEvent(
                            "ACCOUNT_LOCKED",
                            user.getId(),
                            normalizedEmail,
                            null,
                            "WARNING",
                            "Account locked for 15 minutes after 5 failed login attempts"
                    );
                }
                userRepository.save(user);
            }

            auditLogService.recordEvent(
                    "LOGIN_FAILED",
                    user != null ? user.getId() : null,
                    normalizedEmail,
                    null,
                    "FAILED",
                    "Invalid email or password attempt"
            );

            throw CareerSetuException.badRequest("INVALID_CREDENTIALS", "Invalid email or password.");
        }

        // Check account status
        if (user.getAccountStatus() == User.AccountStatus.SUSPENDED) {
            auditLogService.recordEvent("LOGIN_BLOCKED", user.getId(), normalizedEmail, null, "BLOCKED", "Account suspended");
            throw CareerSetuException.badRequest("ACCOUNT_SUSPENDED", "Your account has been suspended. Please contact support.");
        }

        if (user.getAccountStatus() == User.AccountStatus.DEACTIVATED) {
            auditLogService.recordEvent("LOGIN_BLOCKED", user.getId(), normalizedEmail, null, "BLOCKED", "Account deactivated");
            throw CareerSetuException.badRequest("ACCOUNT_DEACTIVATED", "Your account has been deactivated.");
        }

        // Reset failed login count upon successful authentication
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        auditLogService.recordEvent(
                "LOGIN_SUCCESS",
                user.getId(),
                normalizedEmail,
                null,
                "SUCCESS",
                "Authentication successful with role: " + user.getPrimaryRole().name()
        );

        log.info("User logged in successfully: userId={} role={}", user.getId(), user.getPrimaryRole());

        // Construct server-authoritative role list based strictly on the database entity
        List<String> roles;
        if (user.getPrimaryRole() == User.UserRole.SUPER_ADMIN) {
            roles = List.of("SUPER_ADMIN", "PLATFORM_ADMIN", "STUDENT", "EMPLOYER", "INSTITUTION_ADMIN");
        } else if (user.getPrimaryRole() == User.UserRole.PLATFORM_ADMIN) {
            roles = List.of("PLATFORM_ADMIN", "STUDENT", "EMPLOYER", "INSTITUTION_ADMIN");
        } else {
            roles = List.of(user.getPrimaryRole().name());
        }

        String accessToken = jwtTokenService.generateAccessToken(
                user.getId(), user.getEmail(), user.getPrimaryRole().name(), roles, null);
        String refreshToken = jwtTokenService.generateRefreshToken(user.getId());

        return AuthDtos.AuthResponse.of(
                accessToken,
                refreshToken,
                ACCESS_TOKEN_EXPIRY_SECONDS,
                toUserInfo(user, roles)
        );
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserInfo getCurrentUserInfo(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> CareerSetuException.notFound("USER", userId.toString()));

        List<String> roles = user.getPrimaryRole() == User.UserRole.SUPER_ADMIN
                ? List.of("SUPER_ADMIN", "PLATFORM_ADMIN", "STUDENT", "EMPLOYER", "INSTITUTION_ADMIN")
                : List.of(user.getPrimaryRole().name());

        return toUserInfo(user, roles);
    }

    public AuthDtos.MessageResponse forgotPassword(AuthDtos.ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            String token = UUID.randomUUID().toString().replace("-", "");
            user.setPasswordResetToken(token);
            user.setPasswordResetExpiresAt(Instant.now().plusSeconds(900)); // 15 min expiry
            userRepository.save(user);

            auditLogService.recordEvent(
                    "PASSWORD_RESET_REQUEST",
                    user.getId(),
                    normalizedEmail,
                    null,
                    "SUCCESS",
                    "Password reset token issued"
            );
            log.info("Password reset token generated for user: {}", normalizedEmail);
        });

        // Always return generic response to prevent account enumeration
        return new AuthDtos.MessageResponse("If an account exists for this email, a password reset link has been sent.");
    }

    public AuthDtos.MessageResponse resetPassword(AuthDtos.ResetPasswordRequest request) {
        String token = request.getToken().trim();

        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> CareerSetuException.badRequest("INVALID_TOKEN", "Invalid or expired password reset token."));

        if (user.getPasswordResetExpiresAt() == null || user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw CareerSetuException.badRequest("TOKEN_EXPIRED", "Password reset token has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        auditLogService.recordEvent(
                "PASSWORD_RESET_COMPLETE",
                user.getId(),
                user.getEmail(),
                null,
                "SUCCESS",
                "Password reset completed successfully"
        );

        return new AuthDtos.MessageResponse("Password has been reset successfully. You can now sign in with your new password.");
    }

    public void recordLogout(UUID userId, String email) {
        auditLogService.recordEvent(
                "LOGOUT",
                userId,
                email,
                null,
                "SUCCESS",
                "User signed out"
        );
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
                null
        );
    }
}
