package backend.model;

import backend.enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Column(nullable = true)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String provider; // GOOGLE

    @Column(nullable = false)
    private boolean notificationsEnabled = true;

    // Constructors
    public User() {}

    public User(String email, String name, Role role, String provider) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.provider = provider;
    }

    // Getters & Setters
    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }
    
    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
}