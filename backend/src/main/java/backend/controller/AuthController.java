package backend.controller;

import backend.config.JwtUtil;
import backend.dto.LoginRequest;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔐 LOGIN FOR ADMIN & TECHNICIAN
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ❗ Only ADMIN & TECHNICIAN allowed
        if (user.getRole().name().equals("USER")) {
            throw new RuntimeException("Users must login using Google OAuth");
        }

        // 🔐 Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 🎟 Generate JWT
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    @GetMapping("/admin/test")
    public String adminTest() {
        return "Hello ADMIN";
    }
}