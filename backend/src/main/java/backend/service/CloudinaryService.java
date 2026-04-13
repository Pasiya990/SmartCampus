package backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) return null;

            Map upload = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "smartcampus"));

            return upload.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }
}