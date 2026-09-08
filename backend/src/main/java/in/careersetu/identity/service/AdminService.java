package in.careersetu.identity.service;

import in.careersetu.applications.repository.ApplicationRepository;
import in.careersetu.audit.entity.AuditLog;
import in.careersetu.audit.service.AuditLogService;
import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.identity.dto.AdminDtos;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.students.repository.StudentProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;

    public AdminService(UserRepository userRepository,
                        StudentProfileRepository studentProfileRepository,
                        OpportunityRepository opportunityRepository,
                        ApplicationRepository applicationRepository,
                        AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.opportunityRepository = opportunityRepository;
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public AdminDtos.PlatformStats getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalStudents = studentProfileRepository.count();
        long totalOpportunities = opportunityRepository.count();
        long totalApplications = applicationRepository.count();

        long totalAdmins = userRepository.findAll().stream()
                .filter(u -> u.getPrimaryRole() == User.UserRole.SUPER_ADMIN || u.getPrimaryRole() == User.UserRole.PLATFORM_ADMIN)
                .count();

        long totalEmployers = userRepository.findAll().stream()
                .filter(u -> u.getPrimaryRole() == User.UserRole.EMPLOYER || u.getPrimaryRole() == User.UserRole.RECRUITER)
                .count();

        return new AdminDtos.PlatformStats(
                totalUsers,
                totalStudents,
                totalEmployers,
                totalOpportunities,
                totalApplications,
                totalAdmins,
                "CONNECTED",
                Instant.now()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminDtos.AdminUserSummary> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    public AdminDtos.AdminUserSummary updateUserRole(UUID targetUserId, String newRoleStr, String adminEmail) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> CareerSetuException.notFound("USER", targetUserId.toString()));

        User.UserRole newRole;
        try {
            newRole = User.UserRole.valueOf(newRoleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw CareerSetuException.badRequest("INVALID_ROLE", "Role not recognized: " + newRoleStr);
        }

        User.UserRole oldRole = user.getPrimaryRole();
        user.setPrimaryRole(newRole);
        User updated = userRepository.save(user);

        auditLogService.recordEvent(
                "ROLE_CHANGE",
                targetUserId,
                adminEmail,
                null,
                "SUCCESS",
                String.format("Changed role of %s from %s to %s", user.getEmail(), oldRole, newRole)
        );

        return toSummary(updated);
    }

    public AdminDtos.AdminUserSummary updateUserStatus(UUID targetUserId, String newStatusStr, String adminEmail) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> CareerSetuException.notFound("USER", targetUserId.toString()));

        User.AccountStatus newStatus;
        try {
            newStatus = User.AccountStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw CareerSetuException.badRequest("INVALID_STATUS", "Status not recognized: " + newStatusStr);
        }

        User.AccountStatus oldStatus = user.getAccountStatus();
        user.setAccountStatus(newStatus);
        User updated = userRepository.save(user);

        auditLogService.recordEvent(
                "ACCOUNT_STATUS_CHANGE",
                targetUserId,
                adminEmail,
                null,
                "SUCCESS",
                String.format("Changed account status of %s from %s to %s", user.getEmail(), oldStatus, newStatus)
        );

        return toSummary(updated);
    }

    @Transactional(readOnly = true)
    public List<AdminDtos.AuditLogDto> getRecentAuditLogs(int limit) {
        List<AuditLog> logs = auditLogService.getRecentLogs(limit);
        return logs.stream()
                .map(l -> new AdminDtos.AuditLogDto(
                        l.getId(),
                        l.getEventType(),
                        l.getActorEmail(),
                        l.getStatus(),
                        l.getDetails(),
                        l.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    private AdminDtos.AdminUserSummary toSummary(User u) {
        return new AdminDtos.AdminUserSummary(
                u.getId(),
                u.getEmail(),
                u.getFullName(),
                u.getDisplayName(),
                u.getPrimaryRole() != null ? u.getPrimaryRole().name() : "STUDENT",
                u.getAccountStatus() != null ? u.getAccountStatus().name() : "ACTIVE",
                u.isEmailVerified(),
                u.getLastLoginAt(),
                u.getCreatedAt()
        );
    }
}
