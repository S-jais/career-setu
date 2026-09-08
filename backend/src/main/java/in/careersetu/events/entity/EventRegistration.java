package in.careersetu.events.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "user_name", nullable = false, length = 150)
    private String userName;

    @Column(name = "user_email", nullable = false, length = 150)
    private String userEmail;

    @Column(name = "team_name", length = 150)
    private String teamName;

    @Column(name = "registered_at", nullable = false)
    private Instant registeredAt = Instant.now();

    public EventRegistration() {}

    public EventRegistration(UUID id, UUID eventId, UUID userId, String userName,
                             String userEmail, String teamName, Instant registeredAt) {
        this.id = id;
        this.eventId = eventId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.teamName = teamName;
        this.registeredAt = registeredAt != null ? registeredAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public Instant getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(Instant registeredAt) { this.registeredAt = registeredAt; }
}
