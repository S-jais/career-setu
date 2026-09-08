package in.careersetu.companies.repository;

import in.careersetu.companies.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    @Query("SELECT c FROM Company c WHERE c.verificationStatus = 'APPROVED'")
    List<Company> findVerifiedCompanies();

    Optional<Company> findByCin(String cin);
    Optional<Company> findByGstin(String gstin);
}
