package in.careersetu.events.repository;

import in.careersetu.events.entity.CampusEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CampusEventRepository extends JpaRepository<CampusEvent, UUID> {
    List<CampusEvent> findByIsActiveTrueOrderByCreatedAtDesc();
}
