package in.careersetu.notifications.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "User notification center and alerts")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user notifications")
    public ResponseEntity<List<AppNotification>> getMyNotifications(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view notifications.");
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(principal.email()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("unreadCount", 0L));
        }
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(principal.email())));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to update notifications.");
        }
        notificationService.markAllAsRead(principal.email());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
