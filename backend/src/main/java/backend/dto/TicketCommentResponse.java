package backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCommentResponse {

    private Long id;
    private String authorName;
    private String authorRole;
    private String message;
    private LocalDateTime createdAt;
}