package backend.controller;

import backend.dto.ResourceFormDTO;
import backend.model.Resource;
import backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> create(@Valid @ModelAttribute ResourceFormDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resource>> search(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Resource.ResourceStatus status
    ) {
        return ResponseEntity.ok(service.search(type, location, minCapacity, status));
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        return ResponseEntity.ok(service.getTypes());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Resource>> getAvailable() {
        return ResponseEntity.ok(service.getAvailable());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> update(@PathVariable Long id,
                                           @Valid @ModelAttribute ResourceFormDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateStatus(@PathVariable Long id,
                                                 @RequestBody Map<String, String> body) {
        String statusValue = body.get("status");

        if (statusValue == null || statusValue.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }

        Resource.ResourceStatus status;
        try {
            status = Resource.ResourceStatus.valueOf(statusValue.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status. Use ACTIVE or OUT_OF_SERVICE");
        }

        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}