package backend.controller;

import backend.dto.AssignTechnicianRequest;
import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
import backend.dto.UpdateTicketStatusRequest;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
import backend.service.IncidentTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import backend.dto.AddTicketCommentRequest;
import backend.dto.TicketCommentResponse;


import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentTicketController {

    private final IncidentTicketService incidentTicketService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<IncidentTicketResponse> createTicket(
        @RequestPart("ticket") String ticketJson,
        @RequestPart(value = "files", required = false) MultipartFile[] files) {

    try {
        ObjectMapper objectMapper = new ObjectMapper();
        CreateIncidentTicketRequest request =
                objectMapper.readValue(ticketJson, CreateIncidentTicketRequest.class);

        IncidentTicketResponse response =
                incidentTicketService.createTicket(request, files);

        return new ResponseEntity<>(response, HttpStatus.CREATED);

    } catch (Exception e) {
        throw new RuntimeException("Invalid ticket JSON", e);
    }
}

    @GetMapping
    public ResponseEntity<List<IncidentTicketResponse>> getAllTickets() {
        return ResponseEntity.ok(incidentTicketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentTicketService.getTicketById(id));
    }

    @PatchMapping("/{id}/assign-technician")
    public ResponseEntity<IncidentTicketResponse> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody AssignTechnicianRequest request) {

        return ResponseEntity.ok(
                incidentTicketService.assignTechnician(id, request.getTechnicianName())
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {

        return ResponseEntity.ok(
                incidentTicketService.updateTicketStatus(id, request)
        );
    }

    @GetMapping("/filter")
    public ResponseEntity<List<IncidentTicketResponse>> filterTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) PriorityLevel priority) {

        return ResponseEntity.ok(
                incidentTicketService.filterTickets(status, priority)
        );
    }

    @PostMapping("/{id}/comments")
        public ResponseEntity<TicketCommentResponse> addComment(
        @PathVariable Long id,
        @Valid @RequestBody AddTicketCommentRequest request) {

        return new ResponseEntity<>(
            incidentTicketService.addComment(id, request),
            HttpStatus.CREATED
    );
}

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketCommentResponse>> getCommentsByTicketId(@PathVariable Long id) {
    return ResponseEntity.ok(incidentTicketService.getCommentsByTicketId(id));
}

@PutMapping("/comments/{commentId}")
public ResponseEntity<TicketCommentResponse> updateComment(
        @PathVariable Long commentId,
        @Valid @RequestBody AddTicketCommentRequest request) {

    return ResponseEntity.ok(
            incidentTicketService.updateComment(commentId, request)
    );
}

@DeleteMapping("/comments/{commentId}")
public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {

    incidentTicketService.deleteComment(commentId);
    return ResponseEntity.ok("Comment deleted successfully");
}
}