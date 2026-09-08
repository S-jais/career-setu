package in.careersetu.identity.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Core user entity — represents any authenticated user in the system.
 *
 * <p>Password hash uses Argon2id. Raw passwords are NEVER stored.
 * Soft-delete via deleted_at. Version field for optimistic locking.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 20)
    private String mobile;

    @Column(name = "password_hash")
    private String passwordHash; // Argon2id hash

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(name = "profile_picture_key")
    private String profilePictureKey;

    @Column(name = "primary_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole primaryRole;

    @Column(name = "account_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @Column(name = "mobile_verified", nullable = false)
    private boolean mobileVerified;

    @Column(name = "oidc_provider", length = 50)
    private String oidcProvider;

    @Column(name = "oidc_subject", length = 255)
    private String oidcSubject;

    @Column(nullable = false, length = 10)
    private String locale;

    @Column(nullable = false, length = 50)
    private String timezone;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "failed_login_count", nullable = false)
    private int failedLoginCount;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "password_reset_token", length = 100)
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private Instant passwordResetExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Version
    @Column(nullable = false)
    private Long version;

    public enum UserRole {
        STUDENT, STUDENT_LEAD, ALUMNI, FACULTY, MENTOR, TPO, DEPARTMENT_ADMIN,
        INSTITUTION_ADMIN, EMPLOYER, RECRUITER, RESEARCH_ORGANIZATION,
        VERIFIER, COMPLIANCE_OFFICER, SCHEME_ADMIN, PLATFORM_ADMIN, SUPER_ADMIN
    }

    public enum AccountStatus {
        PENDING_VERIFICATION, ACTIVE, SUSPENDED, DEACTIVATED, LOCKED
    }

    public User() {}

    public User(UUID id, String email, String mobile, String passwordHash, String fullName,
                String displayName, String profilePictureKey, UserRole primaryRole,
                AccountStatus accountStatus, boolean emailVerified, boolean mobileVerified,
                String oidcProvider, String oidcSubject, String locale, String timezone,
                Instant lastLoginAt, int failedLoginCount, Instant lockedUntil,
                Instant createdAt, Instant updatedAt, Instant deletedAt, Long version) {
        this.id = id;
        this.email = email;
        this.mobile = mobile;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.displayName = displayName;
        this.profilePictureKey = profilePictureKey;
        this.primaryRole = primaryRole;
        this.accountStatus = accountStatus;
        this.emailVerified = emailVerified;
        this.mobileVerified = mobileVerified;
        this.oidcProvider = oidcProvider;
        this.oidcSubject = oidcSubject;
        this.locale = locale;
        this.timezone = timezone;
        this.lastLoginAt = lastLoginAt;
        this.failedLoginCount = failedLoginCount;
        this.lockedUntil = lockedUntil;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.version = version;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfilePictureKey() { return profilePictureKey; }
    public void setProfilePictureKey(String profilePictureKey) { this.profilePictureKey = profilePictureKey; }

    public UserRole getPrimaryRole() { return primaryRole; }
    public void setPrimaryRole(UserRole primaryRole) { this.primaryRole = primaryRole; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isMobileVerified() { return mobileVerified; }
    public void setMobileVerified(boolean mobileVerified) { this.mobileVerified = mobileVerified; }

    public String getOidcProvider() { return oidcProvider; }
    public void setOidcProvider(String oidcProvider) { this.oidcProvider = oidcProvider; }

    public String getOidcSubject() { return oidcSubject; }
    public void setOidcSubject(String oidcSubject) { this.oidcSubject = oidcSubject; }

    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public int getFailedLoginCount() { return failedLoginCount; }
    public void setFailedLoginCount(int failedLoginCount) { this.failedLoginCount = failedLoginCount; }

    public Instant getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(Instant lockedUntil) { this.lockedUntil = lockedUntil; }

    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }

    public Instant getPasswordResetExpiresAt() { return passwordResetExpiresAt; }
    public void setPasswordResetExpiresAt(Instant passwordResetExpiresAt) { this.passwordResetExpiresAt = passwordResetExpiresAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public boolean isActive() {
        return AccountStatus.ACTIVE.equals(accountStatus) && deletedAt == null;
    }

    public boolean isLocked() {
        return lockedUntil != null && lockedUntil.isAfter(Instant.now());
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String email;
        private String mobile;
        private String passwordHash;
        private String fullName;
        private String displayName;
        private String profilePictureKey;
        private UserRole primaryRole;
        private AccountStatus accountStatus;
        private boolean emailVerified;
        private boolean mobileVerified;
        private String oidcProvider;
        private String oidcSubject;
        private String locale = "en";
        private String timezone = "Asia/Kolkata";
        private Instant lastLoginAt;
        private int failedLoginCount = 0;
        private Instant lockedUntil;
        private Instant createdAt;
        private Instant updatedAt;
        private Instant deletedAt;
        private Long version = 0L;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder mobile(String mobile) { this.mobile = mobile; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder displayName(String displayName) { this.displayName = displayName; return this; }
        public Builder profilePictureKey(String profilePictureKey) { this.profilePictureKey = profilePictureKey; return this; }
        public Builder primaryRole(UserRole primaryRole) { this.primaryRole = primaryRole; return this; }
        public Builder accountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; return this; }
        public Builder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public Builder mobileVerified(boolean mobileVerified) { this.mobileVerified = mobileVerified; return this; }
        public Builder oidcProvider(String oidcProvider) { this.oidcProvider = oidcProvider; return this; }
        public Builder oidcSubject(String oidcSubject) { this.oidcSubject = oidcSubject; return this; }
        public Builder locale(String locale) { this.locale = locale; return this; }
        public Builder timezone(String timezone) { this.timezone = timezone; return this; }
        public Builder lastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; return this; }
        public Builder failedLoginCount(int failedLoginCount) { this.failedLoginCount = failedLoginCount; return this; }
        public Builder lockedUntil(Instant lockedUntil) { this.lockedUntil = lockedUntil; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder deletedAt(Instant deletedAt) { this.deletedAt = deletedAt; return this; }
        public Builder version(Long version) { this.version = version; return this; }

        public User build() {
            return new User(id, email, mobile, passwordHash, fullName, displayName, profilePictureKey,
                    primaryRole, accountStatus, emailVerified, mobileVerified, oidcProvider, oidcSubject,
                    locale, timezone, lastLoginAt, failedLoginCount, lockedUntil, createdAt, updatedAt,
                    deletedAt, version);
        }
    }
}
