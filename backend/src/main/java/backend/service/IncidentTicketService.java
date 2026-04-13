package backend.service;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;

public interface IncidentTicketService {
    IncidentTicketResponse createTicket(CreateIncidentTicketRequest request);
}