package in.careersetu.notifications.repository;

import in.careersetu.notifications.entity.AppNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<AppNotification, UUID> {
    List<AppNotification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    long countByRecipientEmailAndReadStatusFalse(String recipientEmail);
}
