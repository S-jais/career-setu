package in.careersetu.mentorship.repository;

import in.careersetu.mentorship.entity.MentorshipSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorshipSessionRepository extends JpaRepository<MentorshipSession, UUID> {
    List<MentorshipSession> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    List<MentorshipSession> findByMentorIdOrderByCreatedAtDesc(UUID mentorId);
}
