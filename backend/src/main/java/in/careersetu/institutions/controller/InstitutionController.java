package in.careersetu.institutions.controller;

import in.careersetu.institutions.entity.InstitutionStudent;
import in.careersetu.institutions.repository.InstitutionStudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/institutions")
@Tag(name = "Institutions", description = "University TPO portal, student cohorts, and NEP credit compliance")
public class InstitutionController {

    private final InstitutionStudentRepository institutionStudentRepository;

    public InstitutionController(InstitutionStudentRepository institutionStudentRepository) {
        this.institutionStudentRepository = institutionStudentRepository;
    }

    @GetMapping("/students")
    @Operation(summary = "Get institution students cohort directory")
    public ResponseEntity<List<InstitutionStudent>> getStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String nepStatus,
            @RequestParam(required = false) String search) {
        List<InstitutionStudent> list = institutionStudentRepository.findAll();

        return ResponseEntity.ok(list.stream()
                .filter(s -> {
                    if (department != null && !department.isBlank() && !department.equalsIgnoreCase("ALL")) {
                        if (s.getDepartment() == null || !s.getDepartment().toLowerCase().contains(department.toLowerCase())) {
                            return false;
                        }
                    }
                    if (nepStatus != null && !nepStatus.isBlank() && !nepStatus.equalsIgnoreCase("ALL")) {
                        if (s.getNepComplianceStatus() == null || !s.getNepComplianceStatus().equalsIgnoreCase(nepStatus)) {
                            return false;
                        }
                    }
                    if (search != null && !search.isBlank()) {
                        String q = search.toLowerCase().trim();
                        boolean nameMatch = s.getName() != null && s.getName().toLowerCase().contains(q);
                        boolean rollMatch = s.getRollNumber() != null && s.getRollNumber().toLowerCase().contains(q);
                        boolean emailMatch = s.getEmail() != null && s.getEmail().toLowerCase().contains(q);
                        return nameMatch || rollMatch || emailMatch;
                    }
                    return true;
                })
                .collect(Collectors.toList()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get campus placement and NEP compliance analytics")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<InstitutionStudent> list = institutionStudentRepository.findAll();
        long total = list.size();
        if (total == 0) {
            return ResponseEntity.ok(Map.of(
                    "totalStudents", 0,
                    "avgCgpa", 0.0,
                    "nepCompliantPercentage", 0,
                    "placementPercentage", 0,
                    "totalPlaced", 0,
                    "nepCompliantCount", 0
            ));
        }

        long placed = list.stream().filter(s -> "PLACED".equalsIgnoreCase(s.getPlacementStatus())).count();
        long nepCompliant = list.stream().filter(s -> "COMPLIANT".equalsIgnoreCase(s.getNepComplianceStatus())).count();
        double avgCgpa = list.stream().mapToDouble(s -> s.getCgpa() != null ? s.getCgpa() : 0.0).average().orElse(0.0);

        int placementPct = (int) Math.round(((double) placed / total) * 100);
        int nepPct = (int) Math.round(((double) nepCompliant / total) * 100);

        return ResponseEntity.ok(Map.of(
                "totalStudents", total,
                "avgCgpa", Math.round(avgCgpa * 100.0) / 100.0,
                "nepCompliantPercentage", nepPct,
                "placementPercentage", placementPct,
                "totalPlaced", placed,
                "nepCompliantCount", nepCompliant
        ));
    }
}
