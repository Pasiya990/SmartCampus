package backend.dto;
 
import backend.model.Resource;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalTime;

@Data
public class ResourceRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotNull(message = "Type is required")
    private Resource.ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String building;
    private String floor;

    @Size(max = 500)
    private String description;

    private String imageUrl;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
}