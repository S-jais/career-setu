package in.careersetu.common.config;

import in.careersetu.audit.service.AuditLogService;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Server-side initializer to ensure the configured Super Admin account is always provisioned
 * and recognized in the database with UserRole.SUPER_ADMIN privileges.
 *
 * Configured securely via environment variables on the server.
 * Never exposes credentials to frontend code.
 */
@Component
@Order(1)
public class SuperAdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SuperAdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Value("${careersetu.superadmin.email:sj6161362@gmail.com}")
    private String superAdminEmail;

    @Value("${careersetu.superadmin.initial-password:Demo@CareerSetu2024}")
    private String initialPassword;

    public SuperAdminInitializer(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Override
    public void run(String... args) {
        String normalizedEmail = superAdminEmail.toLowerCase().trim();

        userRepository.findByEmail(normalizedEmail).ifPresentOrElse(user -> {
            boolean updated = false;
            if (user.getPrimaryRole() != User.UserRole.SUPER_ADMIN) {
                user.setPrimaryRole(User.UserRole.SUPER_ADMIN);
                updated = true;
            }
            if (user.getAccountStatus() != User.AccountStatus.ACTIVE) {
                user.setAccountStatus(User.AccountStatus.ACTIVE);
                updated = true;
            }
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
                updated = true;
            }

            if (updated) {
                userRepository.save(user);
                auditLogService.recordEvent(
                        "SUPER_ADMIN_ELEVATION",
                        user.getId(),
                        normalizedEmail,
                        "127.0.0.1",
                        "SUCCESS",
                        "Server startup: ensured account has UserRole.SUPER_ADMIN in database"
                );
                log.info("Elevated account to SUPER_ADMIN in database: {}", normalizedEmail);
            }
        }, () -> {
            User superAdmin = User.builder()
                    .email(normalizedEmail)
                    .fullName("Super Administrator")
                    .displayName("Super Admin")
                    .passwordHash(passwordEncoder.encode(initialPassword))
                    .primaryRole(User.UserRole.SUPER_ADMIN)
                    .accountStatus(User.AccountStatus.ACTIVE)
                    .emailVerified(true)
                    .mobileVerified(true)
                    .locale("en")
                    .timezone("Asia/Kolkata")
                    .failedLoginCount(0)
                    .version(0L)
                    .build();

            User saved = userRepository.save(superAdmin);
            auditLogService.recordEvent(
                    "SUPER_ADMIN_PROVISIONED",
                    saved.getId(),
                    normalizedEmail,
                    "127.0.0.1",
                    "SUCCESS",
                    "Server startup: provisioned initial SUPER_ADMIN in database"
            );
            log.info("Successfully provisioned SUPER_ADMIN account in database: {}", normalizedEmail);
        });
    }
}
