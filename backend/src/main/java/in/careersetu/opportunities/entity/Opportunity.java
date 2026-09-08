package in.careersetu.opportunities.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "posted_by", nullable = false)
    private UUID postedBy;

    @Column(nullable = false)
    private String type; // INTERNSHIP, FULL_TIME, CONTRACT, APPRENTICESHIP

    @Column(nullable = false)
    private String title;

    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "location_city")
    private String locationCity;

    @Column(name = "location_state")
    private String locationState;

    @Column(name = "work_mode", nullable = false)
    private String workMode = "HYBRID"; // REMOTE, HYBRID, ONSITE

    @Column(name = "stipend_min")
    private Integer stipendMin;

    @Column(name = "stipend_max")
    private Integer stipendMax;

    @Column(name = "salary_min")
    private Integer salaryMin;

    @Column(name = "salary_max")
    private Integer salaryMax;

    private String currency = "INR";

    @Column(name = "is_paid")
    private Boolean isPaid = true;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Column(name = "min_cgpa")
    private BigDecimal minCgpa;

    @Column(name = "min_experience_months")
    private Integer minExperienceMonths = 0;

    private Integer openings = 1;

    @Column(name = "ppo_possible")
    private Boolean ppoPossible = false;

    @Column(nullable = false)
    private String status = "PUBLISHED"; // DRAFT, PUBLISHED, CLOSED

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "applications_count")
    private Integer applicationsCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Opportunity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }

    public UUID getPostedBy() { return postedBy; }
    public void setPostedBy(UUID postedBy) { this.postedBy = postedBy; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public String getLocationState() { return locationState; }
    public void setLocationState(String locationState) { this.locationState = locationState; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public Integer getStipendMin() { return stipendMin; }
    public void setStipendMin(Integer stipendMin) { this.stipendMin = stipendMin; }

    public Integer getStipendMax() { return stipendMax; }
    public void setStipendMax(Integer stipendMax) { this.stipendMax = stipendMax; }

    public Integer getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Integer salaryMin) { this.salaryMin = salaryMin; }

    public Integer getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Integer salaryMax) { this.salaryMax = salaryMax; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public Integer getDurationWeeks() { return durationWeeks; }
    public void setDurationWeeks(Integer durationWeeks) { this.durationWeeks = durationWeeks; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public BigDecimal getMinCgpa() { return minCgpa; }
    public void setMinCgpa(BigDecimal minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMinExperienceMonths() { return minExperienceMonths; }
    public void setMinExperienceMonths(Integer minExperienceMonths) { this.minExperienceMonths = minExperienceMonths; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public Boolean getPpoPossible() { return ppoPossible; }
    public void setPpoPossible(Boolean ppoPossible) { this.ppoPossible = ppoPossible; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public Integer getApplicationsCount() { return applicationsCount; }
    public void setApplicationsCount(Integer applicationsCount) { this.applicationsCount = applicationsCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
