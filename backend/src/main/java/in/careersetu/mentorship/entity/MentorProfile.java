package in.careersetu.mentorship.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears = 5;

    @Column(nullable = false)
    private Double rating = 4.9;

    @Column(name = "sessions_count", nullable = false)
    private Integer sessionsCount = 0;

    @Column(name = "avatar_initials", length = 10)
    private String avatarInitials;

    @Column(name = "gradient", length = 100)
    private String gradient;

    @Column(columnDefinition = "TEXT")
    private String domains; // Comma separated: Distributed Systems, Java, Cloud Native

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "next_available", length = 100)
    private String nextAvailable;

    @Column(length = 200)
    private String languages; // Comma separated: English, Hindi

    @Column(name = "hourly_rate")
    private Integer hourlyRate = 0; // 0 for free/community

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public MentorProfile() {}

    public MentorProfile(UUID id, String fullName, String roleTitle, String company, Integer experienceYears,
                         Double rating, Integer sessionsCount, String avatarInitials, String gradient,
                         String domains, String bio, String nextAvailable, String languages,
                         Integer hourlyRate, Boolean isActive) {
        this.id = id;
        this.fullName = fullName;
        this.roleTitle = roleTitle;
        this.company = company;
        this.experienceYears = experienceYears != null ? experienceYears : 5;
        this.rating = rating != null ? rating : 4.9;
        this.sessionsCount = sessionsCount != null ? sessionsCount : 0;
        this.avatarInitials = avatarInitials;
        this.gradient = gradient != null ? gradient : "from-blue-600 to-indigo-600";
        this.domains = domains;
        this.bio = bio;
        this.nextAvailable = nextAvailable;
        this.languages = languages;
        this.hourlyRate = hourlyRate != null ? hourlyRate : 0;
        this.isActive = isActive != null ? isActive : true;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getSessionsCount() { return sessionsCount; }
    public void setSessionsCount(Integer sessionsCount) { this.sessionsCount = sessionsCount; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public String getGradient() { return gradient; }
    public void setGradient(String gradient) { this.gradient = gradient; }

    public String getDomains() { return domains; }
    public void setDomains(String domains) { this.domains = domains; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getNextAvailable() { return nextAvailable; }
    public void setNextAvailable(String nextAvailable) { this.nextAvailable = nextAvailable; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public Integer getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Integer hourlyRate) { this.hourlyRate = hourlyRate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
