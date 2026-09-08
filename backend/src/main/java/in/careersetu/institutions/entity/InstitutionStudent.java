package in.careersetu.institutions.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "institution_students")
public class InstitutionStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(name = "roll_number")
    private String rollNumber;

    private String department;

    @Column(name = "current_year")
    private Integer currentYear;

    private Double cgpa;

    @Column(name = "nep_credits")
    private Integer nepCredits;

    @Column(name = "nep_compliance_status")
    private String nepComplianceStatus;

    @Column(name = "applications_count")
    private Integer applicationsCount;

    @Column(name = "placement_status")
    private String placementStatus;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "package_lpa")
    private Double packageLpa;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public InstitutionStudent() {}

    public InstitutionStudent(String name, String email, String rollNumber,
                              String department, Integer currentYear, Double cgpa,
                              Integer nepCredits, String nepComplianceStatus,
                              Integer applicationsCount, String placementStatus,
                              String companyName, Double packageLpa) {
        this.name = name;
        this.email = email;
        this.rollNumber = rollNumber;
        this.department = department;
        this.currentYear = currentYear;
        this.cgpa = cgpa;
        this.nepCredits = nepCredits;
        this.nepComplianceStatus = nepComplianceStatus;
        this.applicationsCount = applicationsCount;
        this.placementStatus = placementStatus;
        this.companyName = companyName;
        this.packageLpa = packageLpa;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getCurrentYear() { return currentYear; }
    public void setCurrentYear(Integer currentYear) { this.currentYear = currentYear; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Integer getNepCredits() { return nepCredits; }
    public void setNepCredits(Integer nepCredits) { this.nepCredits = nepCredits; }

    public String getNepComplianceStatus() { return nepComplianceStatus; }
    public void setNepComplianceStatus(String nepComplianceStatus) { this.nepComplianceStatus = nepComplianceStatus; }

    public Integer getApplicationsCount() { return applicationsCount; }
    public void setApplicationsCount(Integer applicationsCount) { this.applicationsCount = applicationsCount; }

    public String getPlacementStatus() { return placementStatus; }
    public void setPlacementStatus(String placementStatus) { this.placementStatus = placementStatus; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
