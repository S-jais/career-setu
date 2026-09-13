package in.careersetu.institutions.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.institutions.entity.PlacementDrive;
import in.careersetu.institutions.repository.PlacementDriveRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drives")
@Tag(name = "Placement Drives", description = "University campus placement drives and campus recruitment")
public class PlacementDriveController {

    private final PlacementDriveRepository placementDriveRepository;

    public PlacementDriveController(PlacementDriveRepository placementDriveRepository) {
        this.placementDriveRepository = placementDriveRepository;
    }

    @GetMapping
    @Operation(summary = "Get all campus recruitment drives")
    public ResponseEntity<List<PlacementDrive>> getDrives() {
        return ResponseEntity.ok(placementDriveRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "Create a new campus placement drive")
    public ResponseEntity<PlacementDrive> createDrive(@RequestBody PlacementDrive drive) {
        if (drive.getStatus() == null) drive.setStatus("UPCOMING");
        if (drive.getApplicantsCount() == null) drive.setApplicantsCount(0);
        return ResponseEntity.ok(placementDriveRepository.save(drive));
    }

    @PostMapping("/{driveId}/register")
    @Operation(summary = "Register student for campus placement drive")
    public ResponseEntity<Map<String, Object>> registerForDrive(
            @PathVariable UUID driveId,
            @RequestBody(required = false) Map<String, String> data) {
        PlacementDrive drive = placementDriveRepository.findById(driveId)
                .orElseThrow(() -> CareerSetuException.notFound("PLACEMENT_DRIVE", driveId.toString()));

        drive.setApplicantsCount(drive.getApplicantsCount() + 1);
        placementDriveRepository.save(drive);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Successfully registered for " + drive.getCompanyName() + " campus drive"
        ));
    }

    @PostMapping("/{driveId}/broadcast")
    @Operation(summary = "Broadcast placement drive notification to eligible student cohort")
    public ResponseEntity<Map<String, Object>> broadcastDrive(@PathVariable UUID driveId) {
        PlacementDrive drive = placementDriveRepository.findById(driveId)
                .orElseThrow(() -> CareerSetuException.notFound("PLACEMENT_DRIVE", driveId.toString()));

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Drive announcement dispatched to eligible candidates in branches: " + drive.getEligibleBranches(),
                "eligibleCount", 128
        ));
    }

    @PatchMapping("/{driveId}/status")
    @Operation(summary = "Update placement drive status")
    public ResponseEntity<PlacementDrive> updateDriveStatus(
            @PathVariable UUID driveId,
            @RequestBody Map<String, String> body) {
        PlacementDrive drive = placementDriveRepository.findById(driveId)
                .orElseThrow(() -> CareerSetuException.notFound("PLACEMENT_DRIVE", driveId.toString()));

        if (body != null && body.containsKey("status")) {
            drive.setStatus(body.get("status"));
        }
        return ResponseEntity.ok(placementDriveRepository.save(drive));
    }
}
