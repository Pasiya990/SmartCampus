package backend.service;

import backend.dto.AddTicketCommentRequest;
import backend.dto.CreateIncidentTicketRequest;
import backend.dto.DeleteTicketCommentRequest;
import backend.dto.IncidentTicketResponse;
import backend.dto.TicketCommentResponse;
import backend.dto.UpdateTicketCommentRequest;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface IncidentTicketService {
    IncidentTicketResponse createTicket(CreateIncidentTicketRequest request, MultipartFile[] files);
    List<IncidentTicketResponse> getAllTickets();
    IncidentTicketResponse getTicketById(Long id);
    IncidentTicketResponse assignTechnician(Long ticketId, String technicianEmail);
    IncidentTicketResponse updateTicketStatus(Long ticketId, backend.dto.UpdateTicketStatusRequest request);
    List<IncidentTicketResponse> filterTickets(TicketStatus status, PriorityLevel priority);
    TicketCommentResponse addComment(Long ticketId, AddTicketCommentRequest request);
    List<TicketCommentResponse> getCommentsByTicketId(Long ticketId);
    TicketCommentResponse updateComment(Long commentId, UpdateTicketCommentRequest request);
    void deleteComment(Long commentId, DeleteTicketCommentRequest request);
    List<IncidentTicketResponse> getTicketsByAssignedTechnician(String assignedTechnician);
    List<IncidentTicketResponse> getTicketsByUser(String email);
}
