package backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    
    @NotNull(message = "Resource ID is required")
    private Long resourceID;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    @Size(max = 255, message = "Purpose must be under 255 characters")
    private String purpose;

    @Min(value = 1, message = "Attendees must be atleast 1")
    private Integer attendees;
}
