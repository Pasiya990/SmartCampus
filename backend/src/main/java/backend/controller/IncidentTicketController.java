package backend.controller;

import backend.dto.CreateIncidentTicketRequest;
import backend.dto.IncidentTicketResponse;
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
}