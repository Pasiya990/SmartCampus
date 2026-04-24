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

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    //  FIXED: Safe helper methods (NO MORE CRASH)
    private String getEmail(Authentication auth) {
        if (auth == null 
            || !auth.isAuthenticated() 
            || "anonymousUser".equals(auth.getPrincipal())) {
            return null; //  important for QR/public access
        }
        return auth.getName();
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication auth
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request, getEmail(auth)));
    }

    
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) BookingStatus status,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                bookingService.getBookings(
                        getEmail(auth),
                        isAdmin(auth),
                        status
                )
        );
    }

    
    //  FIXED: Works for BOTH QR (no auth) and logged-in users
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable Long id,
            Authentication auth
    ) {
        String email = getEmail(auth);   // can be null 
        boolean admin = isAdmin(auth);   // false if not logged in 

        return ResponseEntity.ok(
                bookingService.getBookingById(id, email, admin)
        );
    }

   
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
                bookingService.rejectBooking(id, body.get("reason"))
        );
    }

    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
            @PathVariable Long id,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                bookingService.cancelBooking(id, getEmail(auth))
        );
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

   
    @DeleteMapping("/{id}/own")
    public ResponseEntity<Void> deleteOwnBooking(
            @PathVariable Long id,
            Authentication auth
    ) {
        return ResponseEntity.noContent().build();
    }

  
    @PutMapping("/{id}/edit")
    public ResponseEntity<BookingResponse> editBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                bookingService.editBooking(id, getEmail(auth), request)
        );
    }

    
    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long resourceId,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime
    ) {
        return ResponseEntity.ok(
                bookingService.isSlotAvailable(
                        resourceId,
                        date,
                        startTime,
                        endTime
                )
        );
    }
}