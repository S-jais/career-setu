package in.careersetu.companies.controller;

import in.careersetu.companies.entity.Company;
import in.careersetu.companies.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@Tag(name = "Companies", description = "Verified employer company profiles and GSTIN/MCA verification")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    public record VerifyGstinRequest(String gstin, String cin) {}

    @GetMapping
    @Operation(summary = "List verified companies")
    public ResponseEntity<List<Company>> getVerifiedCompanies() {
        return ResponseEntity.ok(companyService.getVerifiedCompanies());
    }

    @GetMapping("/primary")
    @Operation(summary = "Get primary demo company for current employer")
    public ResponseEntity<Company> getPrimaryCompany() {
        return ResponseEntity.ok(companyService.getPrimaryCompany());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<Company> getCompanyById(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping("/{companyId}/verify-gstin")
    @Operation(summary = "Verify corporate GSTIN and MCA CIN registration")
    public ResponseEntity<Map<String, Object>> verifyGstin(
            @PathVariable UUID companyId,
            @RequestBody VerifyGstinRequest req) {
        return ResponseEntity.ok(companyService.verifyGstin(companyId, req.gstin(), req.cin()));
    }

    @PutMapping("/{companyId}")
    @Operation(summary = "Update corporate company profile")
    public ResponseEntity<Company> updateCompany(
            @PathVariable UUID companyId,
            @RequestBody Company update) {
        return ResponseEntity.ok(companyService.updateCompany(companyId, update));
    }
}
