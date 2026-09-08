package in.careersetu.companies.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "legal_name", nullable = false)
    private String legalName;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "company_type")
    private String companyType; // STARTUP, SME, LARGE, MNC, PSU, NGO

    @Column(length = 21)
    private String cin;

    @Column(length = 15)
    private String gstin;

    @Column(name = "official_domain")
    private String officialDomain;

    private String website;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    private String industry;

    @Column(name = "sub_industry")
    private String subIndustry;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "employee_count_range")
    private String employeeCountRange;

    @Column(name = "headquarters_city")
    private String headquartersCity;

    @Column(name = "headquarters_state")
    private String headquartersState;

    @Column(name = "is_startup")
    private Boolean isStartup = false;

    @Column(name = "dpiit_recognized")
    private Boolean dpiitRecognized = false;

    @Column(name = "verification_status", nullable = false)
    private String verificationStatus = "PENDING"; // PENDING, APPROVED, etc.

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Company() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getCompanyType() { return companyType; }
    public void setCompanyType(String companyType) { this.companyType = companyType; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getOfficialDomain() { return officialDomain; }
    public void setOfficialDomain(String officialDomain) { this.officialDomain = officialDomain; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getSubIndustry() { return subIndustry; }
    public void setSubIndustry(String subIndustry) { this.subIndustry = subIndustry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public String getEmployeeCountRange() { return employeeCountRange; }
    public void setEmployeeCountRange(String employeeCountRange) { this.employeeCountRange = employeeCountRange; }

    public String getHeadquartersCity() { return headquartersCity; }
    public void setHeadquartersCity(String headquartersCity) { this.headquartersCity = headquartersCity; }

    public String getHeadquartersState() { return headquartersState; }
    public void setHeadquartersState(String headquartersState) { this.headquartersState = headquartersState; }

    public Boolean getIsStartup() { return isStartup; }
    public void setIsStartup(Boolean isStartup) { this.isStartup = isStartup; }

    public Boolean getDpiitRecognized() { return dpiitRecognized; }
    public void setDpiitRecognized(Boolean dpiitRecognized) { this.dpiitRecognized = dpiitRecognized; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
