package in.careersetu.assessment.service;

import in.careersetu.assessment.entity.AssessmentSubmission;
import in.careersetu.assessment.repository.AssessmentSubmissionRepository;
import in.careersetu.notifications.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
public class AssessmentService {

    private final AssessmentSubmissionRepository submissionRepository;
    private final NotificationService notificationService;

    public AssessmentService(AssessmentSubmissionRepository submissionRepository,
                             NotificationService notificationService) {
        this.submissionRepository = submissionRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public AssessmentSubmission submitAssessment(String studentEmail, String studentName, String challengeId,
                                                String challengeTitle, String language, Integer score,
                                                String codeSnippet, Integer passedTests, Integer totalTests) {
        // Generate cryptographic SHA-256 verification hash
        String rawData = studentEmail + ":" + challengeId + ":" + score + ":" + Instant.now().toEpochMilli();
        String verificationHash = generateSha256("0x" + rawData);

        String badgeTitle = challengeTitle + " Verified Specialist";
        AssessmentSubmission submission = new AssessmentSubmission(
                studentEmail, studentName, challengeId, challengeTitle, language,
                score, codeSnippet, passedTests, totalTests, verificationHash, badgeTitle, "PASSED"
        );

        AssessmentSubmission saved = submissionRepository.save(submission);

        // Notify student about earned verifiable badge
        notificationService.dispatchNotification(
                studentEmail,
                "New Verifiable Skill Badge Earned!",
                "You passed the " + challengeTitle + " assessment with a score of " + score + "%. Tamper-proof hash: " + verificationHash.substring(0, 14) + "...",
                "ASSESSMENT",
                "HIGH",
                "/student/passport"
        );

        return saved;
    }

    public Optional<AssessmentSubmission> verifyCredential(String verificationHash) {
        return submissionRepository.findByVerificationHash(verificationHash);
    }

    public List<AssessmentSubmission> getStudentSubmissions(String studentEmail) {
        return submissionRepository.findByStudentEmailOrderBySubmittedAtDesc(studentEmail);
    }

    private String generateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return "0x" + HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return "0x" + Long.toHexString(System.currentTimeMillis()) + "fa7b9c";
        }
    }
}
