package backend.service.impl;

import backend.model.Notification;
import backend.repository.NotificationRepository;
import backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void createNotification(String email, String message) {
        Notification notification = Notification.builder()
                .email(email)
                .message(message)
                .readStatus(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByEmailOrderByCreatedAtDesc(email);
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }
}