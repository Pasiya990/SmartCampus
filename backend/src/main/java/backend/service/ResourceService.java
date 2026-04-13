package backend.service;

import backend.dto.ResourceFormDTO;
import backend.exception.ResourceNotFoundException;
import backend.model.Resource;
import backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository repository;
    private final CloudinaryService cloudinaryService;

    public Resource create(ResourceFormDTO dto) {
        String imageUrl = cloudinaryService.uploadImage(dto.getImage());

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

        String imageUrl = cloudinaryService.uploadImage(dto.getImage());
        if (imageUrl != null) {
            existing.setImageUrl(imageUrl);
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

    public List<Resource> search(Resource.ResourceType type, String location,
                                 Integer minCapacity, Resource.ResourceStatus status) {
        return repository.search(type, location, minCapacity, status);
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