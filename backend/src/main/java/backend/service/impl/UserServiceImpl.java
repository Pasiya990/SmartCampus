package backend.service.impl;

import backend.model.User;
import backend.repository.UserRepository;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public void updateNotificationPreference(String email, boolean enabled) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setNotificationsEnabled(enabled);
        userRepository.save(user);
    }
}