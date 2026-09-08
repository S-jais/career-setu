package in.careersetu.mentorship.repository;

import in.careersetu.mentorship.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, UUID> {
    List<MentorProfile> findByIsActiveTrue();

    @Query("SELECT m FROM MentorProfile m WHERE m.isActive = true AND " +
           "(LOWER(m.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.company) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.domains) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<MentorProfile> searchMentors(@Param("query") String query);
}
