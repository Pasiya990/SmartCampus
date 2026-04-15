package backend.service.impl;

import backend.dto.*;
import backend.exception.ResourceNotFoundException;
import backend.model.IncidentTicket;
import backend.model.TicketAttachment;
import backend.model.TicketStatus;
import backend.repository.IncidentTicketRepository;
import backend.repository.TicketAttachmentRepository;
import backend.service.CloudinaryService;
import backend.service.IncidentTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import backend.model.TicketComment;
import backend.repository.TicketCommentRepository;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IncidentTicketServiceImpl implements IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final CloudinaryService cloudinaryService;
    private final TicketCommentRepository ticketCommentRepository;

    @Override
    public IncidentTicketResponse createTicket(CreateIncidentTicketRequest request, MultipartFile[] files) {

        validateAttachments(files);

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

        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    saveAttachment(savedTicket, file);
                }
                else {
            System.out.println("Empty file skipped");
        }
            }
        }

        IncidentTicket finalTicket = incidentTicketRepository.findById(savedTicket.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + savedTicket.getId()));

        return mapToResponse(finalTicket);
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

    @Override
    public List<IncidentTicketResponse> filterTickets(TicketStatus status, backend.model.PriorityLevel priority) {
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

    @Override
public TicketCommentResponse addComment(Long ticketId, AddTicketCommentRequest request) {
    IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

    TicketComment comment = TicketComment.builder()
            .authorName(request.getAuthorName())
            .authorRole(request.getAuthorRole())
            .message(request.getMessage())
            .ticket(ticket)
            .build();

    TicketComment savedComment = ticketCommentRepository.save(comment);

    ticket.getComments().add(savedComment);

    return mapToCommentResponse(savedComment);
}

@Override
public List<TicketCommentResponse> getCommentsByTicketId(Long ticketId) {
    incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

    return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
            .stream()
            .map(this::mapToCommentResponse)
            .toList();
}

    private void validateAttachments(MultipartFile[] files) {
        if (files == null) {
            return;
        }

        int nonEmptyCount = 0;
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                nonEmptyCount++;

                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new IllegalArgumentException("Only image files are allowed");
                }
            }
        }

        if (nonEmptyCount > 3) {
            throw new IllegalArgumentException("A ticket can include up to 3 image attachments");
        }
    }

    private TicketCommentResponse mapToCommentResponse(TicketComment comment) {
    return TicketCommentResponse.builder()
            .id(comment.getId())
            .authorName(comment.getAuthorName())
            .authorRole(comment.getAuthorRole())
            .message(comment.getMessage())
            .createdAt(comment.getCreatedAt())
            .build();
}

    private void saveAttachment(IncidentTicket ticket, MultipartFile file) {
    try {
        System.out.println("Uploading to Cloudinary: " + file.getOriginalFilename());

        Map uploadResult = cloudinaryService.uploadFile(file);

        System.out.println("Upload success: " + uploadResult.get("secure_url"));

        TicketAttachment attachment = TicketAttachment.builder()
                .fileName(file.getOriginalFilename())
                .fileUrl((String) uploadResult.get("secure_url"))
                .publicId((String) uploadResult.get("public_id"))
                .ticket(ticket)
                .build();

        TicketAttachment savedAttachment = ticketAttachmentRepository.save(attachment);
        ticket.getAttachments().add(savedAttachment);
        System.out.println("Saved attachment to DB");

    } catch (IOException e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to upload attachment", e);
    }
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
        List<TicketAttachmentResponse> attachmentResponses =
                ticket.getAttachments() == null ? Collections.emptyList() :
                        ticket.getAttachments().stream()
                                .map(attachment -> TicketAttachmentResponse.builder()
                                        .id(attachment.getId())
                                        .fileName(attachment.getFileName())
                                        .fileUrl(attachment.getFileUrl())
                                        .publicId(attachment.getPublicId())
                                        .build())
                                .toList();

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
                .attachments(attachmentResponses)
                .build();
    }
}