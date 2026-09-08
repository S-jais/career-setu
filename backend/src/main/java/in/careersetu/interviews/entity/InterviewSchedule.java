package in.careersetu.interviews.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_schedules")
public class InterviewSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(name = "candidate_name", nullable = false, length = 150)
    private String candidateName;

    @Column(name = "candidate_email", nullable = false, length = 150)
    private String candidateEmail;

    @Column(name = "interviewer_id")
    private UUID interviewerId;

    @Column(name = "interviewer_name", nullable = false, length = 150)
    private String interviewerName;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(name = "round", nullable = false, length = 50)
    private String round; // TECHNICAL_1, SYSTEM_DESIGN, BEHAVIORAL, FINAL_ROUND

    @Column(name = "date_str", length = 50)
    private String dateStr;

    @Column(name = "time_str", length = 50)
    private String timeStr;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt = Instant.now();

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    @Column(name = "meeting_url", length = 300)
    private String meetingUrl;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "evaluation_score")
    private Integer evaluationScore;

    public InterviewSchedule() {}

    public InterviewSchedule(UUID id, UUID candidateId, String candidateName, String candidateEmail,
                             UUID interviewerId, String interviewerName, String companyName,
                             String roleTitle, String round, String dateStr, String timeStr,
                             Instant scheduledAt, Integer durationMinutes, String meetingUrl,
                             String status, String notes, Integer evaluationScore) {
        this.id = id;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.interviewerId = interviewerId;
        this.interviewerName = interviewerName;
        this.companyName = companyName;
        this.roleTitle = roleTitle;
        this.round = round;
        this.dateStr = dateStr;
        this.timeStr = timeStr;
        this.scheduledAt = scheduledAt != null ? scheduledAt : Instant.now();
        this.durationMinutes = durationMinutes != null ? durationMinutes : 45;
        this.meetingUrl = meetingUrl;
        this.status = status != null ? status : "SCHEDULED";
        this.notes = notes;
        this.evaluationScore = evaluationScore;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCandidateId() { return candidateId; }
    public void setCandidateId(UUID candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public UUID getInterviewerId() { return interviewerId; }
    public void setInterviewerId(UUID interviewerId) { this.interviewerId = interviewerId; }

    public String getInterviewerName() { return interviewerName; }
    public void setInterviewerName(String interviewerName) { this.interviewerName = interviewerName; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }

    public String getDateStr() { return dateStr; }
    public void setDateStr(String dateStr) { this.dateStr = dateStr; }

    public String getTimeStr() { return timeStr; }
    public void setTimeStr(String timeStr) { this.timeStr = timeStr; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getEvaluationScore() { return evaluationScore; }
    public void setEvaluationScore(Integer evaluationScore) { this.evaluationScore = evaluationScore; }
}
