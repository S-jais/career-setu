package in.careersetu.common.security;

import java.util.List;
import java.util.UUID;

/**
 * Authenticated principal stored in the security context.
 *
 * <p>Contains all relevant identity information for authorization decisions.
 * Never expose sensitive data (password hash, etc.) in this principal.
 */
public record CareerSetuPrincipal(
        UUID userId,
        String email,
        String primaryRole,
        List<String> roles,
        String tenantId
) {
    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }

    public boolean isStudent() { return hasRole("STUDENT"); }
    public boolean isEmployer() { return hasRole("EMPLOYER"); }
    public boolean isRecruiter() { return hasRole("RECRUITER"); }
    public boolean isTpo() { return hasRole("TPO"); }
    public boolean isFaculty() { return hasRole("FACULTY"); }
    public boolean isInstitutionAdmin() { return hasRole("INSTITUTION_ADMIN"); }
    public boolean isPlatformAdmin() { return hasRole("PLATFORM_ADMIN"); }
    public boolean isSuperAdmin() { return hasRole("SUPER_ADMIN"); }

    public boolean belongsToTenant(String tenantId) {
        return this.tenantId != null && this.tenantId.equals(tenantId);
    }
}
