package backend.dto;

import backend.model.Resource;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;

@Data
public class ResourceFormDTO {

    @NotBlank
    private String name;

    @NotNull
    private Resource.ResourceType type;

    @Min(1)
    private Integer capacity;

    @NotBlank
    private String location;

    private String building;
    private String floor;
    private String description;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;

    private MultipartFile image;
}