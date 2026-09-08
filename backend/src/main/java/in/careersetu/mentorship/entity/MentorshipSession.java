package in.careersetu.mentorship.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentorship_sessions")
public class MentorshipSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "mentor_id", nullable = false)
    private UUID mentorId;

    @Column(name = "mentor_name", nullable = false, length = 150)
    private String mentorName;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "scheduled_time", nullable = false, length = 100)
    private String scheduledTime;

    @Column(nullable = false, length = 200)
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    @Column(nullable = false, length = 30)
    private String status = "CONFIRMED"; // CONFIRMED, COMPLETED, CANCELLED

    @Column(name = "meeting_link", length = 300)
    private String meetingLink;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public MentorshipSession() {}

    public MentorshipSession(UUID id, UUID mentorId, String mentorName, UUID studentId, String studentName,
                             String scheduledTime, String topic, String goals, Integer durationMinutes,
                             String status, String meetingLink) {
        this.id = id;
        this.mentorId = mentorId;
        this.mentorName = mentorName;
        this.studentId = studentId;
        this.studentName = studentName;
        this.scheduledTime = scheduledTime;
        this.topic = topic;
        this.goals = goals;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 45;
        this.status = status != null ? status : "CONFIRMED";
        this.meetingLink = meetingLink;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getMentorId() { return mentorId; }
    public void setMentorId(UUID mentorId) { this.mentorId = mentorId; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
