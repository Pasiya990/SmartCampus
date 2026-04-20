package backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String userEmail;
    private boolean isRead;

    private LocalDateTime createdAt;
}