package backend.service;

public interface UserService {
    void updateNotificationPreference(String email, boolean enabled);
}
