package in.careersetu.identity.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.identity.dto.AdminDtos;
import in.careersetu.identity.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Privileged endpoints for Super Admin and Platform Admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PLATFORM_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform metrics and telemetry")
    public ResponseEntity<AdminDtos.PlatformStats> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered platform users")
    public ResponseEntity<List<AdminDtos.AdminUserSummary>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role (Super Admin only)")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminDtos.AdminUserSummary> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody AdminDtos.UpdateUserRoleRequest request,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole(), principal.email()));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user account status")
    public ResponseEntity<AdminDtos.AdminUserSummary> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody AdminDtos.UpdateUserStatusRequest request,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus(), principal.email()));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get recent security and administrative audit logs")
    public ResponseEntity<List<AdminDtos.AuditLogDto>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getRecentAuditLogs(50));
    }
}
