package in.careersetu.events.repository;

import in.careersetu.events.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
    List<EventRegistration> findByUserIdOrderByRegisteredAtDesc(UUID userId);
    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);
    List<EventRegistration> findByEventIdOrderByRegisteredAtDesc(UUID eventId);
}
