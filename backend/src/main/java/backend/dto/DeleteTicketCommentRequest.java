package backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteTicketCommentRequest {

    @NotBlank(message = "Actor name is required")
    private String actorName;

    @NotBlank(message = "Actor role is required")
    private String actorRole;
}