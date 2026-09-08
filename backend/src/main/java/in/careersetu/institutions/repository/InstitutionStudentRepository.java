package in.careersetu.institutions.repository;

import in.careersetu.institutions.entity.InstitutionStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstitutionStudentRepository extends JpaRepository<InstitutionStudent, UUID> {
    Optional<InstitutionStudent> findByEmail(String email);
}
