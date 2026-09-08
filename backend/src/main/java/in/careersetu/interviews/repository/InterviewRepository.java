package in.careersetu.interviews.repository;

import in.careersetu.interviews.entity.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewSchedule, UUID> {
    List<InterviewSchedule> findAllByOrderByScheduledAtDesc();
    List<InterviewSchedule> findByCandidateIdOrderByScheduledAtDesc(UUID candidateId);
}
