package in.careersetu.applications.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "opportunity_id", nullable = false)
    private UUID opportunityId;

    @Column(name = "student_profile_id", nullable = false)
    private UUID studentProfileId;

    @Column(nullable = false)
    private String status = "APPLIED"; // APPLIED, SHORTLISTED, ASSESSMENT, INTERVIEW, OFFERED, REJECTED

    @Column(name = "cover_note", columnDefinition = "TEXT")
    private String coverNote;

    @Column(name = "match_score")
    private BigDecimal matchScore;

    @Column(name = "ai_explanation", columnDefinition = "TEXT")
    private String aiExplanation;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private Instant appliedAt = Instant.now();

    @Column(name = "last_activity_at", nullable = false)
    private Instant lastActivityAt = Instant.now();

    public Application() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOpportunityId() { return opportunityId; }
    public void setOpportunityId(UUID opportunityId) { this.opportunityId = opportunityId; }

    public UUID getStudentProfileId() { return studentProfileId; }
    public void setStudentProfileId(UUID studentProfileId) { this.studentProfileId = studentProfileId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public BigDecimal getMatchScore() { return matchScore; }
    public void setMatchScore(BigDecimal matchScore) { this.matchScore = matchScore; }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public Instant getAppliedAt() { return appliedAt; }
    public void setAppliedAt(Instant appliedAt) { this.appliedAt = appliedAt; }

    public Instant getLastActivityAt() { return lastActivityAt; }
    public void setLastActivityAt(Instant lastActivityAt) { this.lastActivityAt = lastActivityAt; }
}
