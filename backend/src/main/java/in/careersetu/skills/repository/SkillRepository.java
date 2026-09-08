package in.careersetu.skills.repository;

import in.careersetu.skills.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    Optional<Skill> findBySlug(String slug);

    @Query("SELECT s FROM Skill s WHERE s.isActive = true AND LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.name ASC")
    List<Skill> searchSkills(String query);

    @Query("SELECT s FROM Skill s WHERE s.isActive = true AND s.industryDemand = 'HIGH' ORDER BY s.name ASC")
    List<Skill> findHighDemandSkills();
}
