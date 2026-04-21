package backend.service.impl;

import backend.model.Notification;
import backend.repository.NotificationRepository;
import backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import backend.model.User;
import backend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(String email, String message) {

        // ✅ get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🚫 STOP if notifications disabled
        if (!user.isNotificationsEnabled()) {
            return;
        }

        // ✅ create notification (your structure unchanged)
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

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public void markAllAsRead(String email) {
        List<Notification> list = notificationRepository.findByEmailOrderByCreatedAtDesc(email);
    
        list.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(list);
    }
    
    @Override
    public void clearAllNotifications(String email) {
        List<Notification> list = notificationRepository.findByEmailOrderByCreatedAtDesc(email);
        notificationRepository.deleteAll(list);
    }

}