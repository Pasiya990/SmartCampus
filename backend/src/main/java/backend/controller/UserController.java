package backend.controller;


import org.springframework.web.bind.annotation.*;

import backend.dto.NotificationPreferenceRequest;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // ✅ GET USER
    @GetMapping("/{email}")
    public User getUser(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ UPDATE NOTIFICATION PREFERENCE
    @PutMapping("/notifications/{email}")
    public void updateNotificationPreference(
            @PathVariable String email,
            @RequestBody NotificationPreferenceRequest request
    ) {
        userService.updateNotificationPreference(email, request.isEnabled());
    }
}