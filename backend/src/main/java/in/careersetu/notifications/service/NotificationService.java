package in.careersetu.notifications.service;

import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public AppNotification dispatchNotification(String recipientEmail, String title, String message,
                                               String type, String priority, String actionLink) {
        AppNotification notification = new AppNotification(
                recipientEmail, title, message, type, priority, actionLink
        );
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<AppNotification> getNotificationsForUser(String recipientEmail) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(recipientEmail);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setReadStatus(true);
            notificationRepository.save(n);
        });
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String recipientEmail) {
        return notificationRepository.countByRecipientEmailAndReadStatusFalse(recipientEmail);
    }
}
