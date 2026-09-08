package in.careersetu.opportunities.repository;

import in.careersetu.opportunities.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {
    List<Opportunity> findByStatus(String status);
    List<Opportunity> findByCompanyId(UUID companyId);
}
