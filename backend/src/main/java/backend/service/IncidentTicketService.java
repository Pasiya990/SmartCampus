package backend.service;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface IncidentTicketService {
    IncidentTicketResponse createTicket(CreateIncidentTicketRequest request, MultipartFile[] files);
    List<IncidentTicketResponse> getAllTickets();
    IncidentTicketResponse getTicketById(Long id);
    IncidentTicketResponse assignTechnician(Long ticketId, String technicianName);
    IncidentTicketResponse updateTicketStatus(Long ticketId, backend.dto.UpdateTicketStatusRequest request);
    List<IncidentTicketResponse> filterTickets(TicketStatus status, PriorityLevel priority);

}
