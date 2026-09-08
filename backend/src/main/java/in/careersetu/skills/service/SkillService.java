package in.careersetu.skills.service;

import in.careersetu.skills.entity.Skill;
import in.careersetu.skills.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllActiveSkills() {
        return skillRepository.findAll();
    }

    public List<Skill> searchSkills(String query) {
        if (query == null || query.isBlank()) {
            return skillRepository.findHighDemandSkills();
        }
        return skillRepository.searchSkills(query.trim());
    }

    public List<Skill> getHighDemandSkills() {
        return skillRepository.findHighDemandSkills();
    }
}
