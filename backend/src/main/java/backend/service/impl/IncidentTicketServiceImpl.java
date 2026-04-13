package backend.service.impl;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
import backend.exception.ResourceNotFoundException;
import backend.model.IncidentTicket;
import backend.repository.IncidentTicketRepository;
import backend.service.IncidentTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentTicketServiceImpl implements IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;

    @Override
    public IncidentTicketResponse createTicket(CreateIncidentTicketRequest request) {

        IncidentTicket ticket = IncidentTicket.builder()
                .ticketCode(generateTicketCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .location(request.getLocation())
                .resourceName(request.getResourceName())
                .preferredContact(request.getPreferredContact())
                .contactName(request.getContactName())
                .reportedBy(request.getReportedBy())
                .build();

        IncidentTicket savedTicket = incidentTicketRepository.save(ticket);

        return mapToResponse(savedTicket);
    }

    @Override
    public List<IncidentTicketResponse> getAllTickets() {
        return incidentTicketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public IncidentTicketResponse getTicketById(Long id) {
        IncidentTicket ticket = incidentTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        return mapToResponse(ticket);
    }

    private String generateTicketCode() {
        long count = incidentTicketRepository.count() + 1;
        return String.format("TKT-%04d", count);
    }

    private IncidentTicketResponse mapToResponse(IncidentTicket ticket) {
        return IncidentTicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .location(ticket.getLocation())
                .resourceName(ticket.getResourceName())
                .preferredContact(ticket.getPreferredContact())
                .contactName(ticket.getContactName())
                .reportedBy(ticket.getReportedBy())
                .assignedTechnician(ticket.getAssignedTechnician())
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}