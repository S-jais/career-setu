package in.careersetu.mentorship.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.mentorship.dto.MentorshipDtos;
import in.careersetu.mentorship.service.MentorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mentors")
@Tag(name = "Mentorship", description = "Industry mentorship profiles, matching, and 1:1 sessions")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping
    @Operation(summary = "List and search verified industry mentors")
    public ResponseEntity<List<MentorshipDtos.MentorResponse>> getMentors(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(mentorService.getMentors(search));
    }

    @PostMapping("/book")
    @Operation(summary = "Book a 1:1 mentorship guidance session")
    public ResponseEntity<MentorshipDtos.MentorshipSessionResponse> bookSession(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody MentorshipDtos.BookSessionRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to book a session.");
        }
        return ResponseEntity.ok(mentorService.bookSession(principal.userId(), req));
    }

    @GetMapping("/my-sessions")
    @Operation(summary = "Get student's booked mentorship sessions")
    public ResponseEntity<List<MentorshipDtos.MentorshipSessionResponse>> getMySessions(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view sessions.");
        }
        return ResponseEntity.ok(mentorService.getStudentSessions(principal.userId()));
    }
}
