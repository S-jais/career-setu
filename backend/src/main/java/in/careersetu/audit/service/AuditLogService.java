package in.careersetu.audit.service;

import in.careersetu.audit.entity.AuditLog;
import in.careersetu.audit.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEvent(String eventType, UUID userId, String actorEmail, String ipAddress, String status, String details) {
        try {
            AuditLog auditLog = new AuditLog(eventType, userId, actorEmail, ipAddress, status, details);
            auditLogRepository.save(auditLog);
            log.info("Audit event recorded: [{}] actor={} status={}", eventType, actorEmail, status);
        } catch (Exception e) {
            log.error("Failed to persist audit log event: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs(int limit) {
        return auditLogRepository.findRecentLogs(PageRequest.of(0, Math.min(limit, 100)));
    }
}
