package backend.repository;

import backend.model.Booking;
import backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    //Get all bookings for a specific user
    List<Booking> findByUserId(Long userId);

    //Filter bookings by status
    List<Booking>findByStatus(BookingStatus status);

    //Check for scheduling conflicts
    @Query("""
        SELECT b FROM Booking b
        WHERE b.resource.id = :resourceId
        AND b.date = :date
        AND b.status IN (backend.model.BookingStatus.APPROVED, backend.model.BookingStatus.PENDING)
        AND (b.startTime < :endTime AND b.endTime > :startTime)
    """)
    List<Booking> findConflictingBookings(
        @Param("resourceId") Long resourceId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
        
}
