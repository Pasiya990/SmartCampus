package backend.service.impl;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
import backend.dto.UpdateTicketStatusRequest;
import backend.exception.ResourceNotFoundException;
import backend.model.IncidentTicket;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
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

    @Override
    public IncidentTicketResponse assignTechnician(Long ticketId, String technicianName) {

        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        ticket.setAssignedTechnician(technicianName);

        if (ticket.getStatus() == null || ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        IncidentTicket updated = incidentTicketRepository.save(ticket);

        return mapToResponse(updated);
    }

    @Override
    public IncidentTicketResponse updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request) {

        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        TicketStatus currentStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();

        validateStatusTransition(currentStatus, newStatus, request);

        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(request.getResolutionNotes());
            ticket.setRejectionReason(null);
        } else if (newStatus == TicketStatus.REJECTED) {
            ticket.setRejectionReason(request.getRejectionReason());
            ticket.setResolutionNotes(null);
        }

        IncidentTicket updated = incidentTicketRepository.save(ticket);

        return mapToResponse(updated);
    }

    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus, UpdateTicketStatusRequest request) {

        if (currentStatus == TicketStatus.OPEN && !(newStatus == TicketStatus.IN_PROGRESS || newStatus == TicketStatus.REJECTED)) {
            throw new IllegalArgumentException("OPEN tickets can only move to IN_PROGRESS or REJECTED");
        }

        if (currentStatus == TicketStatus.IN_PROGRESS && newStatus != TicketStatus.RESOLVED) {
            throw new IllegalArgumentException("IN_PROGRESS tickets can only move to RESOLVED");
        }

        if (currentStatus == TicketStatus.RESOLVED && newStatus != TicketStatus.CLOSED) {
            throw new IllegalArgumentException("RESOLVED tickets can only move to CLOSED");
        }

        if (currentStatus == TicketStatus.CLOSED) {
            throw new IllegalArgumentException("CLOSED tickets cannot be updated");
        }

        if (currentStatus == TicketStatus.REJECTED) {
            throw new IllegalArgumentException("REJECTED tickets cannot be updated");
        }

        if (newStatus == TicketStatus.REJECTED &&
                (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty())) {
            throw new IllegalArgumentException("Rejection reason is required when rejecting a ticket");
        }

        if (newStatus == TicketStatus.RESOLVED &&
                (request.getResolutionNotes() == null || request.getResolutionNotes().trim().isEmpty())) {
            throw new IllegalArgumentException("Resolution notes are required when resolving a ticket");
        }
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

    @Override
public List<IncidentTicketResponse> filterTickets(TicketStatus status, PriorityLevel priority) {

    List<IncidentTicket> tickets;

    if (status != null && priority != null) {
        tickets = incidentTicketRepository.findByStatusAndPriority(status, priority);
    } else if (status != null) {
        tickets = incidentTicketRepository.findByStatus(status);
    } else if (priority != null) {
        tickets = incidentTicketRepository.findByPriority(priority);
    } else {
        tickets = incidentTicketRepository.findAll();
    }

    return tickets.stream()
            .map(this::mapToResponse)
            .toList();
}
}