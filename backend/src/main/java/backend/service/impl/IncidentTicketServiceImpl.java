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
import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.TicketEmailService;
import backend.service.NotificationService;

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
    private final UserRepository userRepository;
    private final TicketEmailService ticketEmailService;
    private final NotificationService notificationService;

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

        notificationService.createNotification(
            request.getReportedBy(),
            "Your ticket " + savedTicket.getTicketCode() + " has been created"
        );

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
                .map(this::mapToListResponse)
                .toList();
    }

    @Override
    public IncidentTicketResponse getTicketById(Long id) {
        IncidentTicket ticket = incidentTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        return mapToResponse(ticket);
    }

   @Override
public IncidentTicketResponse assignTechnician(Long ticketId, String technicianEmail) {
    IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

    User technician = userRepository.findByEmail(technicianEmail)
            .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + technicianEmail));

    if (technician.getRole() != Role.TECHNICIAN) {
        throw new IllegalArgumentException("Selected email does not belong to a technician");
    }

    ticket.setAssignedTechnician(technicianEmail);

    if (ticket.getStatus() == null || ticket.getStatus() == TicketStatus.OPEN) {
        ticket.setStatus(TicketStatus.IN_PROGRESS);
    }

    IncidentTicket updated = incidentTicketRepository.save(ticket);

    // Notify technician
    notificationService.createNotification(
        technicianEmail,
        "You have been assigned to ticket " + updated.getTicketCode()
    );

    // Notify user
    notificationService.createNotification(
        updated.getReportedBy(),
        "Your ticket has been assigned to a technician"
    );

    try {
        ticketEmailService.sendTicketAssignedEmail(
                technicianEmail,
                updated.getTicketCode(),
                updated.getTitle(),
                updated.getPriority().name(),
                updated.getLocation()
        );
    } catch (Exception e) {
        e.printStackTrace();
    }

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

        notificationService.createNotification(
            updated.getReportedBy(),
            "Your ticket " + updated.getTicketCode() + " status changed to " + newStatus
        );
        
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

@Override
public List<IncidentTicketResponse> getTicketsByAssignedTechnician(String technicianEmail) {
    return incidentTicketRepository.findByAssignedTechnicianIgnoreCase(technicianEmail)
            .stream()
            .map(this::mapToListResponse)
            .toList();
}

@Override
public TicketCommentResponse updateComment(Long commentId, UpdateTicketCommentRequest request) {

    TicketComment comment = ticketCommentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

    boolean isOwner =
            comment.getAuthorName().equalsIgnoreCase(request.getEditorName()) &&
            comment.getAuthorRole().equalsIgnoreCase(request.getEditorRole());

    if (!isOwner) {
        throw new IllegalArgumentException("Only the comment owner can edit this comment");
    }

    comment.setMessage(request.getMessage());

    TicketComment updated = ticketCommentRepository.save(comment);

    return mapToCommentResponse(updated);
}

@Override
public List<IncidentTicketResponse> getTicketsByUser(String email) {
    return incidentTicketRepository.findByReportedBy(email)
            .stream()
            .map(this::mapToListResponse)
            .toList();
}

@Override
public void deleteComment(Long commentId, DeleteTicketCommentRequest request) {

    TicketComment comment = ticketCommentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

    boolean isOwner =
            comment.getAuthorName().equalsIgnoreCase(request.getActorName()) &&
            comment.getAuthorRole().equalsIgnoreCase(request.getActorRole());

    boolean isAdmin = "ADMIN".equalsIgnoreCase(request.getActorRole());

    if (!isOwner && !isAdmin) {
        throw new IllegalArgumentException("Only the comment owner or admin can delete this comment");
    }

    ticketCommentRepository.delete(comment);
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
    int nextNumber = 1;

    var lastTicket = incidentTicketRepository.findTopByOrderByIdDesc();

    if (lastTicket.isPresent() && lastTicket.get().getTicketCode() != null) {
        String lastCode = lastTicket.get().getTicketCode(); // example: TKT-0008
        int lastNumber = Integer.parseInt(lastCode.substring(4));
        nextNumber = lastNumber + 1;
    }

    return String.format("TKT-%04d", nextNumber);
}
    private IncidentTicketResponse mapToListResponse(IncidentTicket ticket) {
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
                .attachments(Collections.emptyList())
                .build();
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

long ageInMinutes = 0;
Long resolutionTimeInMinutes = null;
String timerLabel = "Pending";

if (ticket.getCreatedAt() != null) {
    ageInMinutes = java.time.Duration
            .between(ticket.getCreatedAt(), java.time.LocalDateTime.now())
            .toMinutes();
}

if ((ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED)
        && ticket.getUpdatedAt() != null) {
    resolutionTimeInMinutes = java.time.Duration
            .between(ticket.getCreatedAt(), ticket.getUpdatedAt())
            .toMinutes();
}

if (ticket.getStatus() == TicketStatus.OPEN) {
    timerLabel = "Pending";
} else if (ticket.getStatus() == TicketStatus.IN_PROGRESS) {
    timerLabel = "Being handled";
} else if (ticket.getStatus() == TicketStatus.RESOLVED) {
    timerLabel = "Resolved";
} else if (ticket.getStatus() == TicketStatus.CLOSED) {
    timerLabel = "Closed";
} else if (ticket.getStatus() == TicketStatus.REJECTED) {
    timerLabel = "Rejected";
}
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

        // ✅ NEW FIELDS
        .ageInMinutes(ageInMinutes)
        .resolutionTimeInMinutes(resolutionTimeInMinutes)
        .timerLabel(timerLabel)

        .build();
    }
}