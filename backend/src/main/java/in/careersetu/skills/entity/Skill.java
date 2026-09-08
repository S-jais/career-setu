package in.careersetu.skills.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "industry_demand", length = 20)
    private String industryDemand; // HIGH, MEDIUM, LOW, EMERGING

    @Column(name = "is_technical")
    private Boolean isTechnical = true;

    @Column(name = "is_soft_skill")
    private Boolean isSoftSkill = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Skill() {}

    public Skill(UUID id, String name, String slug, String description, String industryDemand,
                 Boolean isTechnical, Boolean isSoftSkill, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.industryDemand = industryDemand;
        this.isTechnical = isTechnical;
        this.isSoftSkill = isSoftSkill;
        this.isActive = isActive;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIndustryDemand() { return industryDemand; }
    public void setIndustryDemand(String industryDemand) { this.industryDemand = industryDemand; }

    public Boolean getIsTechnical() { return isTechnical; }
    public void setIsTechnical(Boolean isTechnical) { this.isTechnical = isTechnical; }

    public Boolean getIsSoftSkill() { return isSoftSkill; }
    public void setIsSoftSkill(Boolean isSoftSkill) { this.isSoftSkill = isSoftSkill; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
