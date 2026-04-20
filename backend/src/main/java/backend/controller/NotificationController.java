package backend.controller;

import backend.model.Notification;
import backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{email}")
    public List<Notification> getNotifications(@PathVariable String email) {
        return notificationService.getUserNotifications(email);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}