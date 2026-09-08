package in.careersetu.audit.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Audit log entity for security, authentication, and administrative actions.
 * Never stores raw passwords, JWT tokens, or credentials.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_logs_event_type", columnList = "event_type"),
    @Index(name = "idx_audit_logs_actor_email", columnList = "actor_email"),
    @Index(name = "idx_audit_logs_created_at", columnList = "created_at")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "actor_email", length = 255)
    private String actorEmail;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // SUCCESS, FAILED, WARNING

    @Column(name = "details", length = 1000)
    private String details;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuditLog() {}

    public AuditLog(String eventType, UUID userId, String actorEmail, String ipAddress, String status, String details) {
        this.eventType = eventType;
        this.userId = userId;
        this.actorEmail = actorEmail;
        this.ipAddress = ipAddress;
        this.status = status;
        this.details = details;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
