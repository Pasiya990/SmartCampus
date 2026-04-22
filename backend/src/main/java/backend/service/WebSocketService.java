package backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String email, String message) {
        // send to specific user topic
        messagingTemplate.convertAndSend("/topic/notifications/" + email, message);
    }
}