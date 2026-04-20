package backend.dto;

import backend.model.IncidentCategory;
import backend.model.PriorityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateIncidentTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private IncidentCategory category;

    @NotNull(message = "Priority is required")
    private PriorityLevel priority;

    @NotBlank(message = "Location is required")
    private String location;
    
    private Long resourceId;

    private String resourceName;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;

    private String contactName;

    @NotBlank(message = "Reported by is required")
    private String reportedBy;
}