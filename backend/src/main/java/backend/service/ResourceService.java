package backend.service;

import backend.dto.ResourceFormDTO;
import backend.exception.ResourceNotFoundException;
import backend.model.Resource;
import backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository repository;
    private final CloudinaryService cloudinaryService;

    public Resource create(ResourceFormDTO dto) {

        String imageUrl = null;

        try {
            if (dto.getImage() != null && !dto.getImage().isEmpty()) {
                Map uploadResult = cloudinaryService.uploadFile(dto.getImage());
                imageUrl = (String) uploadResult.get("secure_url");
            }
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }

        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .building(dto.getBuilding())
                .floor(dto.getFloor())
                .description(dto.getDescription())
                .imageUrl(imageUrl)
                .availabilityStart(dto.getAvailabilityStart())
                .availabilityEnd(dto.getAvailabilityEnd())
                .status(Resource.ResourceStatus.ACTIVE)
                .build();

        return repository.save(resource);
    }

    public List<Resource> getAll() {
        return repository.findAll();
    }

    public Resource getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource update(Long id, ResourceFormDTO dto) {
        Resource existing = getById(id);

        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setBuilding(dto.getBuilding());
        existing.setFloor(dto.getFloor());
        existing.setDescription(dto.getDescription());
        existing.setAvailabilityStart(dto.getAvailabilityStart());
        existing.setAvailabilityEnd(dto.getAvailabilityEnd());

        try {
            if (dto.getImage() != null && !dto.getImage().isEmpty()) {
                Map uploadResult = cloudinaryService.uploadFile(dto.getImage());
                String imageUrl = (String) uploadResult.get("secure_url");
                existing.setImageUrl(imageUrl);
            }
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }

        return repository.save(existing);
    }

    public Resource updateStatus(Long id, Resource.ResourceStatus status) {
        Resource resource = getById(id);
        resource.setStatus(status);
        return repository.save(resource);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Resource> search(Resource.ResourceType type, String keyword,
                                 Integer minCapacity, Resource.ResourceStatus status) {

        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);

        return repository.findAll().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> minCapacity == null || (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> {
                    if (normalizedKeyword.isBlank()) return true;

                    String location = r.getLocation() == null ? "" : r.getLocation().toLowerCase(Locale.ROOT);
                    String building = r.getBuilding() == null ? "" : r.getBuilding().toLowerCase(Locale.ROOT);

                    return location.contains(normalizedKeyword) || building.contains(normalizedKeyword);
                })
                .toList();
    }

    public List<String> getTypes() {
        return Arrays.stream(Resource.ResourceType.values())
                .map(Enum::name)
                .toList();
    }

    public List<Resource> getAvailable() {
        return repository.findByStatus(Resource.ResourceStatus.ACTIVE);
    }
}