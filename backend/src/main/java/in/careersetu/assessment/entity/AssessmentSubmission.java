package in.careersetu.assessment.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assessment_submissions")
public class AssessmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "challenge_id", nullable = false)
    private String challengeId;

    @Column(name = "challenge_title", nullable = false)
    private String challengeTitle;

    private String language;

    private Integer score;

    @Column(name = "code_snippet", columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(name = "passed_tests")
    private Integer passedTests;

    @Column(name = "total_tests")
    private Integer totalTests;

    @Column(name = "verification_hash", nullable = false, unique = true)
    private String verificationHash;

    @Column(name = "badge_title")
    private String badgeTitle;

    private String status = "PASSED";

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt = Instant.now();

    public AssessmentSubmission() {}

    public AssessmentSubmission(String studentEmail, String studentName, String challengeId,
                                String challengeTitle, String language, Integer score,
                                String codeSnippet, Integer passedTests, Integer totalTests,
                                String verificationHash, String badgeTitle, String status) {
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.challengeId = challengeId;
        this.challengeTitle = challengeTitle;
        this.language = language;
        this.score = score;
        this.codeSnippet = codeSnippet;
        this.passedTests = passedTests;
        this.totalTests = totalTests;
        this.verificationHash = verificationHash;
        this.badgeTitle = badgeTitle;
        this.status = status;
        this.submittedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }

    public String getChallengeTitle() { return challengeTitle; }
    public void setChallengeTitle(String challengeTitle) { this.challengeTitle = challengeTitle; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public Integer getPassedTests() { return passedTests; }
    public void setPassedTests(Integer passedTests) { this.passedTests = passedTests; }

    public Integer getTotalTests() { return totalTests; }
    public void setTotalTests(Integer totalTests) { this.totalTests = totalTests; }

    public String getVerificationHash() { return verificationHash; }
    public void setVerificationHash(String verificationHash) { this.verificationHash = verificationHash; }

    public String getBadgeTitle() { return badgeTitle; }
    public void setBadgeTitle(String badgeTitle) { this.badgeTitle = badgeTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
