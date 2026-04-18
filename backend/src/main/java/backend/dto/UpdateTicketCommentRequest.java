package backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTicketCommentRequest {

    @NotBlank(message = "Editor name is required")
    private String editorName;

    @NotBlank(message = "Editor role is required")
    private String editorRole;

    @NotBlank(message = "Message is required")
    private String message;
}