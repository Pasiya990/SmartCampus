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
                .build();

        return repository.save(resource);
    }

    public List<Resource> getAll() {
        return repository.findAll();
    }

    public Resource getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }

    public Resource update(Long id, ResourceFormDTO dto) {
        Resource r = getById(id);

        r.setName(dto.getName());
        r.setType(dto.getType());
        r.setCapacity(dto.getCapacity());
        r.setLocation(dto.getLocation());
        r.setBuilding(dto.getBuilding());
        r.setFloor(dto.getFloor());
        r.setDescription(dto.getDescription());

        String imageUrl = cloudinaryService.uploadImage(dto.getImage());
        if (imageUrl != null) r.setImageUrl(imageUrl);

        return repository.save(r);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Resource> search(Resource.ResourceType type, String location,
                                 Integer minCapacity, Resource.ResourceStatus status) {
        return repository.search(type, location, minCapacity, status);
    }

    public List<String> getTypes() {
        return Arrays.stream(Resource.ResourceType.values())
                .map(Enum::name).toList();
    }

    public List<Resource> getAvailable() {
        return repository.findByStatus(Resource.ResourceStatus.ACTIVE);
    }
}