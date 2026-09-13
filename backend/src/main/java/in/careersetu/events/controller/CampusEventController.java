package in.careersetu.events.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.events.dto.EventDtos;
import in.careersetu.events.service.CampusEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@Tag(name = "Events", description = "Campus hackathons, hiring sprints, and masterclasses")
public class CampusEventController {

    private final CampusEventService campusEventService;

    public CampusEventController(CampusEventService campusEventService) {
        this.campusEventService = campusEventService;
    }

    @GetMapping
    @Operation(summary = "Get all active campus events and hackathons")
    public ResponseEntity<List<EventDtos.EventResponse>> getEvents(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID userId = principal != null ? principal.userId() : null;
        return ResponseEntity.ok(campusEventService.getEvents(userId));
    }

    @PostMapping("/{eventId}/register")
    @Operation(summary = "Register for a campus event or hackathon")
    public ResponseEntity<EventDtos.EventRegistrationResponse> registerForEvent(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody(required = false) EventDtos.RegisterEventRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to register for an event.");
        }
        return ResponseEntity.ok(campusEventService.registerForEvent(principal.userId(), eventId, req));
    }

    @GetMapping("/my-registrations")
    @Operation(summary = "Get current student's event registrations")
    public ResponseEntity<List<EventDtos.EventRegistrationResponse>> getMyRegistrations(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view registrations.");
        }
        return ResponseEntity.ok(campusEventService.getMyRegistrations(principal.userId()));
    }
}
