package backend.service;

import backend.model.Notification;
import java.util.List;

public interface NotificationService {

    void createNotification(String email, String message);

    List<Notification> getUserNotifications(String email);

    void markAsRead(Long id);
}