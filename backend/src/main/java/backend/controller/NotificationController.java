package backend.controller;

import backend.model.Notification;
import backend.service.NotificationService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{email}")
    public List<Notification> getUserNotifications(@PathVariable String email) {
        return notificationService.getUserNotifications(email);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    return ResponseEntity.ok("Notification deleted");
    }

        // ✅ Mark all as read
    @PutMapping("/read-all/{email}")
    public ResponseEntity<String> markAllAsRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
    return ResponseEntity.ok("All notifications marked as read");
    }

    // ✅ Delete all notifications
    @DeleteMapping("/clear/{email}")
    public ResponseEntity<String> clearAllNotifications(@PathVariable String email) {
        notificationService.clearAllNotifications(email);
    return ResponseEntity.ok("All notifications deleted");
    }

}