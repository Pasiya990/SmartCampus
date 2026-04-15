package backend.controller;

import backend.dto.AssignTechnicianRequest;
import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
import backend.dto.UpdateTicketStatusRequest;
import backend.service.IncidentTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentTicketController {

    private final IncidentTicketService incidentTicketService;

    @PostMapping
    public ResponseEntity<IncidentTicketResponse> createTicket(
            @Valid @RequestBody CreateIncidentTicketRequest request) {
        IncidentTicketResponse response = incidentTicketService.createTicket(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
}