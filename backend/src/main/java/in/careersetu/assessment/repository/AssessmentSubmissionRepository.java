package in.careersetu.assessment.repository;

import in.careersetu.assessment.entity.AssessmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentSubmissionRepository extends JpaRepository<AssessmentSubmission, UUID> {
    Optional<AssessmentSubmission> findByVerificationHash(String verificationHash);
    List<AssessmentSubmission> findByStudentEmailOrderBySubmittedAtDesc(String studentEmail);
}
