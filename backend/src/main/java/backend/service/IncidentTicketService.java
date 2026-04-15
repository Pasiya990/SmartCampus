package backend.service;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;

import java.util.List;


public interface IncidentTicketService {
    IncidentTicketResponse createTicket(CreateIncidentTicketRequest request);
    List<IncidentTicketResponse> getAllTickets();
    IncidentTicketResponse getTicketById(Long id);
    IncidentTicketResponse assignTechnician(Long ticketId, String technicianName);
}
