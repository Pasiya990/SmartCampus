package backend.service;

import backend.model.*;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final QRCodeService qrCodeService;  
    private final EmailService emailService; 
    private final NotificationService notificationService;

    //  Create booking 
    public BookingResponse createBooking(BookingRequest request, String email) {

        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Start time must be before end time"
            );
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            request.getResourceId(),
            request.getDate(),
            request.getStartTime(),
            request.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "This resource is already booked for the selected time"
            );
        }

        Resource resource = resourceRepository.findById(request.getResourceId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Resource not found"
            ));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        Booking booking = Booking.builder()
            .resource(resource)
            .user(user)
            .date(request.getDate())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .purpose(request.getPurpose())
            .attendees(request.getAttendees())
            .status(BookingStatus.PENDING)
            .build();

        //return toResponse(bookingRepository.save(booking));
        Booking saved = bookingRepository.save(booking);

        // 🔔 NOTIFICATION
        notificationService.createNotification(
            saved.getUser().getEmail(),
            "Your booking request for " + saved.getResource().getName() + " is submitted"
        );
        
        return toResponse(saved);
    }

    //  Get bookings
    public List<BookingResponse> getBookings(String email, boolean isAdmin, BookingStatus statusFilter) {

        List<Booking> bookings;

        if (isAdmin) {
            bookings = (statusFilter != null)
                ? bookingRepository.findByStatus(statusFilter)
                : bookingRepository.findAll();
        } else {
            if (email == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
            }

            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
                ));

            bookings = bookingRepository.findByUserId(user.getId());
        }

        return bookings.stream().map(this::toResponse).toList();
    }

    //  ✅ FIXED: Get single booking (QR + logged users)
    public BookingResponse getBookingById(Long bookingId, String email, boolean isAdmin) {

        Booking booking = getBookingOrThrow(bookingId);

        // ✅ QR / Public access
        if (email == null) {
            return toResponse(booking);
        }

        // ✅ Admin access
        if (isAdmin) {
            return toResponse(booking);
        }

        // ✅ Normal user → enforce ownership
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return toResponse(booking);
    }

    //  Admin approve
    public BookingResponse approveBooking(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only PENDING bookings can be approved"
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        BookingResponse response = toResponse(bookingRepository.save(booking));

        // 🔔 NOTIFICATION
        notificationService.createNotification(
            booking.getUser().getEmail(),
            "Your booking for " + booking.getResource().getName() + " has been APPROVED"
        );

        try {
            String qrContent = qrCodeService.buildQRContent(response);
            byte[] qrCode = qrCodeService.generateQRCode(qrContent);
            emailService.sendBookingApprovedEmail(
                booking.getUser().getEmail(), response, qrCode
            );
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }

        return response;
    }

    //  Admin reject
    public BookingResponse rejectBooking(Long bookingId, String reason) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only PENDING bookings can be rejected"
            );
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);

        //return toResponse(bookingRepository.save(booking));
        Booking saved = bookingRepository.save(booking);

        // 🔔 NOTIFICATION
        notificationService.createNotification(
            saved.getUser().getEmail(),
            "Your booking has been REJECTED. Reason: " + reason
        );
        
        return toResponse(saved);
    }

    //  Cancel booking
    public BookingResponse cancelBooking(Long bookingId, String email) {

        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        Booking booking = getBookingOrThrow(bookingId);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You can only cancel your own booking"
            );
        }

        if (booking.getStatus() == BookingStatus.REJECTED ||
            booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Booking cannot be cancelled in its current state"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        //return toResponse(bookingRepository.save(booking));

        Booking saved = bookingRepository.save(booking);

        // 🔔 NOTIFICATION
        notificationService.createNotification(
            saved.getUser().getEmail(),
            "Your booking has been CANCELLED"
        );
        
        return toResponse(saved);
    }

    //  Admin delete
    public void deleteBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"
            );
        }
        bookingRepository.deleteById(bookingId);
    }

    //  User delete own
    public void deleteOwnBooking(Long bookingId, String email) {

        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        Booking booking = getBookingOrThrow(bookingId);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You can only delete your own bookings"
            );
        }

        if (booking.getStatus() != BookingStatus.CANCELLED &&
            booking.getStatus() != BookingStatus.REJECTED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "You can only delete CANCELLED or REJECTED bookings"
            );
        }

        bookingRepository.deleteById(bookingId);
    }

    //  Edit booking
    public BookingResponse editBooking(Long bookingId, String email, BookingRequest request) {

        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        Booking booking = getBookingOrThrow(bookingId);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You can only edit your own bookings"
            );
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only PENDING bookings can be edited"
            );
        }

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Start time must be before end time"
            );
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            request.getResourceId(),
            request.getDate(),
            request.getStartTime(),
            request.getEndTime()
        ).stream()
            .filter(b -> !b.getId().equals(bookingId))
            .toList();

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "This resource is already booked for the selected time"
            );
        }

        Resource resource = resourceRepository.findById(request.getResourceId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Resource not found"
            ));

        booking.setResource(resource);
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setRejectionReason(null);

        //return toResponse(bookingRepository.save(booking));
        Booking saved = bookingRepository.save(booking);

        // 🔔 NOTIFICATION
        notificationService.createNotification(
            saved.getUser().getEmail(),
            "Your booking has been UPDATED and is pending approval"
        );
        
        return toResponse(saved);
    }

    // Helper
    private Booking getBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"
            ));
    }

    // Mapper
    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
            .id(b.getId())
            .resourceId(b.getResource().getId())
            .resourceName(b.getResource().getName())
            .userEmail(b.getUser().getEmail())
            .date(b.getDate())
            .startTime(b.getStartTime())
            .endTime(b.getEndTime())
            .purpose(b.getPurpose())
            .attendees(b.getAttendees())
            .status(b.getStatus())
            .rejectionReason(b.getRejectionReason())
            .build();
    }

    public boolean isSlotAvailable(Long resourceId, String date,
                               String startTime, String endTime) {

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            resourceId,
            LocalDate.parse(date),
            LocalTime.parse(startTime),
            LocalTime.parse(endTime)
        );

        return conflicts.isEmpty();
    }
}