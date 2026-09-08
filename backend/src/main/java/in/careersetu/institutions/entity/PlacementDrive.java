package in.careersetu.institutions.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "role_title", nullable = false)
    private String roleTitle;

    @Column(name = "ctc_package", nullable = false)
    private String ctcPackage;

    private String stipend;

    @Column(name = "min_cgpa", nullable = false)
    private Double minCgpa = 7.0;

    @Column(name = "eligible_branches", nullable = false)
    private String eligibleBranches = "CSE, IT, AI & DS";

    @Column(name = "drive_date", nullable = false)
    private String driveDate;

    @Column(name = "rounds_summary", length = 1000)
    private String roundsSummary = "Online Assessment, Technical Panel, HR Discussion";

    @Column(nullable = false)
    private String status = "UPCOMING"; // UPCOMING, IN_PROGRESS, OFFERS_RELEASED, COMPLETED

    @Column(name = "applicants_count", nullable = false)
    private Integer applicantsCount = 0;

    @Column(name = "offers_count")
    private Integer offersCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PlacementDrive() {}

    public PlacementDrive(String companyName, String roleTitle, String ctcPackage, String stipend,
                          Double minCgpa, String eligibleBranches, String driveDate,
                          String roundsSummary, String status, Integer applicantsCount, Integer offersCount) {
        this.companyName = companyName;
        this.roleTitle = roleTitle;
        this.ctcPackage = ctcPackage;
        this.stipend = stipend;
        this.minCgpa = minCgpa != null ? minCgpa : 7.0;
        this.eligibleBranches = eligibleBranches != null ? eligibleBranches : "CSE, IT";
        this.driveDate = driveDate;
        this.roundsSummary = roundsSummary != null ? roundsSummary : "Assessment, Technical, HR";
        this.status = status != null ? status : "UPCOMING";
        this.applicantsCount = applicantsCount != null ? applicantsCount : 0;
        this.offersCount = offersCount != null ? offersCount : 0;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getCtcPackage() { return ctcPackage; }
    public void setCtcPackage(String ctcPackage) { this.ctcPackage = ctcPackage; }

    public String getStipend() { return stipend; }
    public void setStipend(String stipend) { this.stipend = stipend; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getEligibleBranches() { return eligibleBranches; }
    public void setEligibleBranches(String eligibleBranches) { this.eligibleBranches = eligibleBranches; }

    public String getDriveDate() { return driveDate; }
    public void setDriveDate(String driveDate) { this.driveDate = driveDate; }

    public String getRoundsSummary() { return roundsSummary; }
    public void setRoundsSummary(String roundsSummary) { this.roundsSummary = roundsSummary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getApplicantsCount() { return applicantsCount; }
    public void setApplicantsCount(Integer applicantsCount) { this.applicantsCount = applicantsCount; }

    public Integer getOffersCount() { return offersCount; }
    public void setOffersCount(Integer offersCount) { this.offersCount = offersCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
