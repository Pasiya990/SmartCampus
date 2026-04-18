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

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // CREATE BOOKING
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
        @Valid @RequestBody BookingRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(bookingService.createBooking(request, email));
    }

    // GET BOOKINGS 
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
        @RequestParam(required = false) BookingStatus status
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(
            bookingService.getBookings(email, isAdmin, status)
        );
    }

    // GET SINGLE BOOKING
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
        @PathVariable Long id
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(
            bookingService.getBookingById(id, email, isAdmin)
        );
    }

    //  ADMIN APPROVE
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approve(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    //  ADMIN REJECT
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
            bookingService.rejectBooking(id, body.get("reason"))
        );
    }

    //  USER CANCEL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
        @PathVariable Long id
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return ResponseEntity.ok(
            bookingService.cancelBooking(id, email)
        );
    }

    //  ADMIN DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
        @PathVariable Long id
    ) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    //USER DELETE OWN 
    @DeleteMapping("/{id}/own")
    public ResponseEntity<Void> deleteOwnBooking(
        @PathVariable Long id
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        bookingService.deleteOwnBooking(id, email);
        return ResponseEntity.noContent().build();
    }

    //USER EDIT OWN
    @PutMapping("/{id}/edit")
    public ResponseEntity<BookingResponse> editBooking(
        @PathVariable Long id,
        @Valid @RequestBody BookingRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return ResponseEntity.ok(
            bookingService.editBooking(id, email, request)
        );
    }

    @GetMapping("/check-availability")
public ResponseEntity<Boolean> checkAvailability(
        @RequestParam Long resourceId,
        @RequestParam String date,
        @RequestParam String startTime,
        @RequestParam String endTime
) {
    boolean available = bookingService.isSlotAvailable(
        resourceId,
        date,
        startTime,
        endTime
    );
    return ResponseEntity.ok(available);
}
}