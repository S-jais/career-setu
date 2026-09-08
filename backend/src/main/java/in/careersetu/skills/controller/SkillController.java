package in.careersetu.skills.controller;

import in.careersetu.skills.entity.Skill;
import in.careersetu.skills.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@Tag(name = "Skills", description = "Skill intelligence and taxonomy catalog")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    @Operation(summary = "Get list of active skills or search by name")
    public ResponseEntity<List<Skill>> getSkills(
            @RequestParam(required = false) String search) {
        List<Skill> skills = skillService.searchSkills(search);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/high-demand")
    @Operation(summary = "Get skills categorized with high market demand")
    public ResponseEntity<List<Skill>> getHighDemandSkills() {
        return ResponseEntity.ok(skillService.getHighDemandSkills());
    }
}
