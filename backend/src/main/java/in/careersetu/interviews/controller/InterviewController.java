package in.careersetu.interviews.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.interviews.dto.InterviewDtos;
import in.careersetu.interviews.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@Tag(name = "Interviews", description = "Recruiter interview scheduling, evaluations, and candidate schedules")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/employer")
    @Operation(summary = "Get all scheduled interviews for employer")
    public ResponseEntity<List<InterviewDtos.InterviewResponse>> getEmployerInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/student")
    @Operation(summary = "Get scheduled interviews for current student")
    public ResponseEntity<List<InterviewDtos.InterviewResponse>> getStudentInterviews(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view student interviews.");
        }
        return ResponseEntity.ok(interviewService.getInterviewsForCandidate(principal.userId()));
    }

    @PostMapping("/schedule")
    @Operation(summary = "Schedule a technical or behavioral interview")
    public ResponseEntity<InterviewDtos.InterviewResponse> scheduleInterview(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody InterviewDtos.ScheduleInterviewRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to schedule an interview.");
        }
        return ResponseEntity.ok(interviewService.scheduleInterview(principal.userId(), req));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update interview status, score, or notes")
    public ResponseEntity<InterviewDtos.InterviewResponse> updateStatus(
            @PathVariable UUID id,
            @RequestBody InterviewDtos.UpdateInterviewStatusRequest req) {
        return ResponseEntity.ok(interviewService.updateInterviewStatus(id, req));
    }
}
