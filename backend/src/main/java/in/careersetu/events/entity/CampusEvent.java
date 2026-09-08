package in.careersetu.events.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "campus_events")
public class CampusEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 150)
    private String organizer;

    @Column(nullable = false, length = 50)
    private String category; // HACKATHON, HIRING_SPRINT, WORKSHOP, COMPETITION

    @Column(nullable = false, length = 50)
    private String mode; // ONLINE, HYBRID, IN_PERSON

    @Column(length = 200)
    private String location;

    @Column(name = "start_date", length = 100)
    private String startDate;

    @Column(name = "end_date", length = 100)
    private String endDate;

    @Column(name = "registration_deadline", length = 100)
    private String registrationDeadline;

    @Column(name = "prize_pool", length = 150)
    private String prizePool;

    @Column(name = "teams_count", nullable = false)
    private Integer teamsCount = 0;

    @Column(name = "max_team_size", nullable = false)
    private Integer maxTeamSize = 4;

    @Column(columnDefinition = "TEXT")
    private String tags; // Comma separated: Generative AI, RAG, FastAPI, Cloud

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String perks; // Semicolon separated perks

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public CampusEvent() {}

    public CampusEvent(UUID id, String title, String organizer, String category, String mode,
                       String location, String startDate, String endDate, String registrationDeadline,
                       String prizePool, Integer teamsCount, Integer maxTeamSize, String tags,
                       String description, String perks, Boolean isActive) {
        this.id = id;
        this.title = title;
        this.organizer = organizer;
        this.category = category;
        this.mode = mode;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.registrationDeadline = registrationDeadline;
        this.prizePool = prizePool;
        this.teamsCount = teamsCount != null ? teamsCount : 0;
        this.maxTeamSize = maxTeamSize != null ? maxTeamSize : 4;
        this.tags = tags;
        this.description = description;
        this.perks = perks;
        this.isActive = isActive != null ? isActive : true;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public String getPrizePool() { return prizePool; }
    public void setPrizePool(String prizePool) { this.prizePool = prizePool; }

    public Integer getTeamsCount() { return teamsCount; }
    public void setTeamsCount(Integer teamsCount) { this.teamsCount = teamsCount; }

    public Integer getMaxTeamSize() { return maxTeamSize; }
    public void setMaxTeamSize(Integer maxTeamSize) { this.maxTeamSize = maxTeamSize; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPerks() { return perks; }
    public void setPerks(String perks) { this.perks = perks; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
