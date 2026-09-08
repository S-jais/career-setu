package in.careersetu.identity.dto;

import jakarta.validation.constraints.*;

public class AuthDtos {

    public static class RegisterRequest {
        @NotBlank
        @Size(min = 2, max = 255)
        private String fullName;

        @NotBlank
        @Email
        @Size(max = 255)
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
            message = "Password must contain uppercase, lowercase, digit, and special character"
        )
        private String password;

        @NotBlank
        private String role; // STUDENT, EMPLOYER, FACULTY, etc.

        // Optional
        private String mobile;
        private String institutionId;   // for students/faculty
        private String companyId;       // for employers/recruiters

        // Consent
        @AssertTrue(message = "You must accept the terms of service")
        private boolean acceptedTerms;

        @AssertTrue(message = "You must accept the privacy policy")
        private boolean acceptedPrivacyPolicy;

        public RegisterRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getInstitutionId() { return institutionId; }
        public void setInstitutionId(String institutionId) { this.institutionId = institutionId; }

        public String getCompanyId() { return companyId; }
        public void setCompanyId(String companyId) { this.companyId = companyId; }

        public boolean isAcceptedTerms() { return acceptedTerms; }
        public void setAcceptedTerms(boolean acceptedTerms) { this.acceptedTerms = acceptedTerms; }

        public boolean isAcceptedPrivacyPolicy() { return acceptedPrivacyPolicy; }
        public void setAcceptedPrivacyPolicy(boolean acceptedPrivacyPolicy) { this.acceptedPrivacyPolicy = acceptedPrivacyPolicy; }
    }

    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        private String deviceInfo;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getDeviceInfo() { return deviceInfo; }
        public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }
    }

    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;

        public RefreshTokenRequest() {}

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class ForgotPasswordRequest {
        @NotBlank
        @Email
        private String email;

        public ForgotPasswordRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        @NotBlank
        private String token;

        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
            message = "Password must contain uppercase, lowercase, digit, and special character"
        )
        private String newPassword;

        public ResetPasswordRequest() {}

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class VerifyEmailRequest {
        @NotBlank
        private String token;

        public VerifyEmailRequest() {}

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }

    // ── Responses ──────────────────────────────────────────────

    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresIn,
            UserInfo user
    ) {
        public static AuthResponse of(String accessToken, String refreshToken,
                                       long expiresIn, UserInfo user) {
            return new AuthResponse(accessToken, refreshToken, "Bearer", expiresIn, user);
        }
    }

    public record UserInfo(
            String id,
            String email,
            String fullName,
            String displayName,
            String primaryRole,
            java.util.List<String> roles,
            boolean emailVerified,
            String profilePictureUrl
    ) {}

    public record MessageResponse(String message) {}

    public record TokenRefreshResponse(
            String accessToken,
            String tokenType,
            long expiresIn
    ) {}
}
