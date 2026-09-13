package in.careersetu.assessment.controller;

import in.careersetu.assessment.entity.AssessmentSubmission;
import in.careersetu.assessment.service.AssessmentService;
import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessment")
@Tag(name = "Assessment", description = "Verifiable skill assessments and cryptographic SHA-256 badge credentials")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    public record SubmitAssessmentRequest(
            String challengeId,
            String challengeTitle,
            String language,
            Integer score,
            String code,
            Integer passedTestCases,
            Integer totalTestCases,
            String name,
            String email
    ) {}

    @PostMapping("/submit")
    @Operation(summary = "Submit code challenge results and earn a tamper-proof cryptographic badge")
    public ResponseEntity<AssessmentSubmission> submitAssessment(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody SubmitAssessmentRequest req) {
        String email = (principal != null && principal.email() != null)
                ? principal.email()
                : (req.email() != null ? req.email() : "student@careersetu.in");
        String name = (req.name() != null && !req.name().isBlank())
                ? req.name()
                : "Student Candidate";

        AssessmentSubmission submission = assessmentService.submitAssessment(
                email,
                name,
                req.challengeId() != null ? req.challengeId() : "general",
                req.challengeTitle() != null ? req.challengeTitle() : "Skill Challenge",
                req.language() != null ? req.language() : "java",
                req.score() != null ? req.score() : 80,
                req.code() != null ? req.code() : "",
                req.passedTestCases() != null ? req.passedTestCases() : 3,
                req.totalTestCases() != null ? req.totalTestCases() : 3
        );
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/verify/{verificationHash}")
    @Operation(summary = "Verify authenticity of a cryptographic skill credential hash")
    public ResponseEntity<AssessmentSubmission> verifyCredential(@PathVariable String verificationHash) {
        return assessmentService.verifyCredential(verificationHash)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> CareerSetuException.notFound("CREDENTIAL", verificationHash));
    }

    @GetMapping("/my-submissions")
    @Operation(summary = "Get current student's completed verifiable assessments")
    public ResponseEntity<List<AssessmentSubmission>> getMySubmissions(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view your assessment badges.");
        }
        return ResponseEntity.ok(assessmentService.getStudentSubmissions(principal.email()));
    }
}
