package backend.service;

import backend.model.*;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    //Create a new booking request
    public BookingResponse createBooking(BookingRequest request, Long userId){
        if (!request.getStartTime().isBefore(request.getEndTime())){
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
        if (!conflicts.isEmpty()){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "This resource is already booked for the selected time"
            );
        }

        Resource resource = resourceRepository.findById(request.getResourceId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Resource not found"
            ));

        User user = userRepository.findById(userId)
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

        return toResponse(bookingRepository.save(booking));
    }

    //Get bookings - admin sees all, user sees own
    public List<BookingResponse> getBookings(Long userId, boolean isAdmin, BookingStatus statusFilter){
        List<Booking> bookings;
        if (isAdmin){
            bookings = (statusFilter != null)
                ? bookingRepository.findByStatus(statusFilter)
                : bookingRepository.findAll();
                
        }else{
            bookings = bookingRepository.findByUserId(userId);

        }
        return bookings.stream().map(this::toResponse).toList();
    }

    //Get single booking
    public BookingResponse getBookingById(Long bookingId, Long userId, boolean isAdmin){
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"
            ));
        if (!isAdmin && !booking.getUser().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return toResponse(booking);
    }

    //Admin approves booking
    public BookingResponse approveBooking(Long bookingId){
        Booking booking = getBookingOrThrow(bookingId);
        if(booking.getStatus() != BookingStatus.PENDING){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only PENDING bookings can be approved"
            );
        }
        booking.setStatus(BookingStatus.APPROVED);
        return toResponse(bookingRepository.save(booking));
    }

    //Admin rejects booking
    public BookingResponse rejectBooking(Long bookingId, String reason){
        Booking booking = getBookingOrThrow(bookingId);
        if(booking.getStatus() != BookingStatus.PENDING){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only PENDING bookings can be rejected"
            );
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        return toResponse(bookingRepository.save(booking));
    }

    //User cancels their own booking
    public BookingResponse cancelBooking(Long bookingId, Long userId){
        Booking booking = getBookingOrThrow(bookingId);
        if(!booking.getUser().getId().equals(userId)){
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You can only cancel your own booking"
            );
        }
        if(booking.getStatus() == BookingStatus.REJECTED ||
           booking.getStatus() == BookingStatus.CANCELLED){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Booking cannot be cancelled in its current state"
            );
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    //Admin deletes booking
    public void deleteBooking(Long bookingId){
        if(!bookingRepository.existsById(bookingId)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"
            );
        }
        bookingRepository.deleteById(bookingId);
    }

    //Helper - get booking or throw 404
    private Booking getBookingOrThrow(Long id){
        return bookingRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"
            ));
    }

    //Map entity to response DTO
    private BookingResponse toResponse(Booking b){
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
}
