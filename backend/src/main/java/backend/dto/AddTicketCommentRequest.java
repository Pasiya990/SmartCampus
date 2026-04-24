package backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddTicketCommentRequest {

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "Author role is required")
    private String authorRole;

    @NotBlank(message = "Message is required")
    private String message;

    // ✅ Added — needed to identify if commenter is the ticket owner
    private String authorEmail;
}