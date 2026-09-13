package in.careersetu.opportunities.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.opportunities.dto.OpportunityDtos;
import in.careersetu.opportunities.service.OpportunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/opportunities")
@Tag(name = "Opportunities", description = "Internship and job marketplace")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    @Operation(summary = "Search and filter published opportunities")
    public ResponseEntity<List<OpportunityDtos.OpportunityResponse>> searchOpportunities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String workMode) {
        return ResponseEntity.ok(opportunityService.searchOpportunities(search, type, workMode));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single opportunity details")
    public ResponseEntity<OpportunityDtos.OpportunityResponse> getOpportunityById(@PathVariable UUID id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @PostMapping
    @Operation(summary = "Post a new internship or job opportunity")
    public ResponseEntity<OpportunityDtos.OpportunityResponse> createOpportunity(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody OpportunityDtos.CreateOpportunityRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to post an opportunity.");
        }
        return ResponseEntity.ok(opportunityService.createOpportunity(principal.userId(), req));
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Close an opportunity from accepting further applications")
    public ResponseEntity<OpportunityDtos.OpportunityResponse> closeOpportunity(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @PathVariable UUID id) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to modify an opportunity.");
        }
        return ResponseEntity.ok(opportunityService.closeOpportunity(id));
    }
}
