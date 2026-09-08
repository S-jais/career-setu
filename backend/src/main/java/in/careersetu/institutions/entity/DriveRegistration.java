package in.careersetu.institutions.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "drive_registrations")
public class DriveRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "drive_id", nullable = false)
    private UUID driveId;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "student_roll_no")
    private String studentRollNo;

    @Column(nullable = false)
    private String status = "REGISTERED"; // REGISTERED, SHORTLISTED, REJECTED, OFFERED

    @Column(name = "registered_at", nullable = false, updatable = false)
    private Instant registeredAt = Instant.now();

    public DriveRegistration() {}

    public DriveRegistration(UUID driveId, String studentEmail, String studentName, String studentRollNo) {
        this.driveId = driveId;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.studentRollNo = studentRollNo;
        this.status = "REGISTERED";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getDriveId() { return driveId; }
    public void setDriveId(UUID driveId) { this.driveId = driveId; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(Instant registeredAt) { this.registeredAt = registeredAt; }
}
