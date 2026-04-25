package backend.controller;

import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    // ✅ GET ALL USERS
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ UPDATE USER ROLE
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        String newRole = body.get("role");

        try {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid role: " + newRole);
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Role updated successfully",
                "userId", id,
                "newRole", user.getRole()
        ));
    }
}