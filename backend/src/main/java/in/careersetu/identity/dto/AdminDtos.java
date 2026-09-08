package in.careersetu.identity.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

public class AdminDtos {

    public record PlatformStats(
            long totalUsers,
            long totalStudents,
            long totalEmployers,
            long totalOpportunities,
            long totalApplications,
            long totalAdmins,
            String databaseStatus,
            Instant serverTime
    ) {}

    public record AdminUserSummary(
            UUID id,
            String email,
            String fullName,
            String displayName,
            String primaryRole,
            String accountStatus,
            boolean emailVerified,
            Instant lastLoginAt,
            Instant createdAt
    ) {}

    public static class UpdateUserRoleRequest {
        @NotBlank
        private String role;

        public UpdateUserRoleRequest() {}
        public UpdateUserRoleRequest(String role) { this.role = role; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class UpdateUserStatusRequest {
        @NotBlank
        private String status;

        public UpdateUserStatusRequest() {}
        public UpdateUserStatusRequest(String status) { this.status = status; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public record AuditLogDto(
            UUID id,
            String eventType,
            String actorEmail,
            String status,
            String details,
            Instant createdAt
    ) {}
}
