package in.careersetu.applications.controller;

import in.careersetu.applications.dto.ApplicationDtos;
import in.careersetu.applications.service.ApplicationService;
import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications", description = "Candidate job applications and recruiter ATS pipeline")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @Operation(summary = "Submit a student application for an opportunity")
    public ResponseEntity<ApplicationDtos.StudentApplicationResponse> apply(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody ApplicationDtos.ApplyRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to submit an application.");
        }
        return ResponseEntity.ok(applicationService.apply(principal.userId(), req));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student's applications")
    public ResponseEntity<List<ApplicationDtos.StudentApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view applications.");
        }
        return ResponseEntity.ok(applicationService.getMyApplications(principal.userId()));
    }

    @GetMapping
    @Operation(summary = "Get all applicants across opportunities (for recruiters/employers)")
    public ResponseEntity<List<ApplicationDtos.OpportunityApplicantResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/opportunity/{opportunityId}")
    @Operation(summary = "Get applicants for a specific opportunity")
    public ResponseEntity<List<ApplicationDtos.OpportunityApplicantResponse>> getOpportunityApplications(
            @PathVariable UUID opportunityId) {
        return ResponseEntity.ok(applicationService.getOpportunityApplications(opportunityId));
    }

    @PatchMapping("/{applicationId}/status")
    @Operation(summary = "Update candidate application status in recruiter ATS")
    public ResponseEntity<ApplicationDtos.OpportunityApplicantResponse> updateStatus(
            @PathVariable UUID applicationId,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("status") : "UNDER_REVIEW";
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, status));
    }
}
