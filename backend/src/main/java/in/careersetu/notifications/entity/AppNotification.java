package in.careersetu.notifications.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_notifications")
public class AppNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false)
    private String type = "SYSTEM"; // APPLICATION, OPPORTUNITY, AI_INSIGHT, ASSESSMENT, SYSTEM

    @Column(nullable = false)
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW

    @Column(name = "read_status", nullable = false)
    private Boolean readStatus = false;

    @Column(name = "action_link")
    private String actionLink;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public AppNotification() {}

    public AppNotification(String recipientEmail, String title, String message, String type, String priority, String actionLink) {
        this.recipientEmail = recipientEmail;
        this.title = title;
        this.message = message;
        this.type = type != null ? type : "SYSTEM";
        this.priority = priority != null ? priority : "NORMAL";
        this.actionLink = actionLink;
        this.readStatus = false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Boolean getReadStatus() { return readStatus; }
    public void setReadStatus(Boolean readStatus) { this.readStatus = readStatus; }

    public String getActionLink() { return actionLink; }
    public void setActionLink(String actionLink) { this.actionLink = actionLink; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
