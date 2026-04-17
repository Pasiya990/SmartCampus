package backend.dto;

import backend.model.IncidentCategory;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentTicketResponse {

    private Long id;
    private String ticketCode;
    private String title;
    private String description;
    private IncidentCategory category;
    private PriorityLevel priority;
    private TicketStatus status;
    private String location;
    private String resourceName;
    private String preferredContact;
    private String contactName;
    private String reportedBy;
    private String assignedTechnician;
    private String rejectionReason;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TicketAttachmentResponse> attachments;
    private Long ageInMinutes;
    private Long resolutionTimeInMinutes;
    private String timerLabel;

}