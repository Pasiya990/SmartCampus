package backend.controller;

import backend.model.BookingRequest;
import backend.model.BookingResponse;
import backend.model.BookingStatus;
import backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings — create booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
        @Valid @RequestBody BookingRequest request,
        @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(bookingService.createBooking(request, userId));
    }

    // GET /api/bookings — get all (admin) or own (user)
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
        @RequestParam(required = false) BookingStatus status
    ) {
        boolean isAdmin = "ADMIN".equals(role);
        return ResponseEntity.ok(
            bookingService.getBookings(userId, isAdmin, status)
        );
    }

    // GET /api/bookings/{id} — get one booking
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role
    ) {
        return ResponseEntity.ok(
            bookingService.getBookingById(id, userId, "ADMIN".equals(role))
        );
    }

    // PUT /api/bookings/{id}/approve — admin approves
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approve(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    // PUT /api/bookings/{id}/reject — admin rejects
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
            bookingService.rejectBooking(id, body.get("reason"))
        );
    }

    // PUT /api/bookings/{id}/cancel — user cancels
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // DELETE /api/bookings/{id} — admin deletes
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
        @PathVariable Long id
    ) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/bookings/{id}/own — user deletes own cancelled/rejected booking
@DeleteMapping("/{id}/own")
public ResponseEntity<Void> deleteOwnBooking(
    @PathVariable Long id,
    @RequestHeader("X-User-Id") Long userId
) {
    bookingService.deleteOwnBooking(id, userId);
    return ResponseEntity.noContent().build();
}

// PUT /api/bookings/{id}/edit — user edits own pending booking
@PutMapping("/{id}/edit")
public ResponseEntity<BookingResponse> editBooking(
    @PathVariable Long id,
    @RequestHeader("X-User-Id") Long userId,
    @Valid @RequestBody BookingRequest request
) {
    return ResponseEntity.ok(bookingService.editBooking(id, userId, request));
}
}