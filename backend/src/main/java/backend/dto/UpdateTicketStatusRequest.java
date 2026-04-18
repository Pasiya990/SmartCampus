package backend.dto;

import backend.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTicketStatusRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String rejectionReason;

    private String resolutionNotes;
}