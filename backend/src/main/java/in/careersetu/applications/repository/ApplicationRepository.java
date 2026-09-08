package in.careersetu.applications.repository;

import in.careersetu.applications.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByStudentProfileId(UUID studentProfileId);
    List<Application> findByOpportunityId(UUID opportunityId);
    boolean existsByOpportunityIdAndStudentProfileId(UUID opportunityId, UUID studentProfileId);
}
