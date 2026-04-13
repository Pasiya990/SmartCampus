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
            if (file == null || file.isEmpty()) {
                return null;
            }

            String contentType = file.getContentType();
            System.out.println("File content type: " + contentType);

            if (contentType == null ||
                    !(contentType.equals("image/jpeg")
                            || contentType.equals("image/png")
                            || contentType.equals("image/jpg"))) {
                throw new IllegalArgumentException("Only JPG and PNG image files are allowed");
            }

            Map<?, ?> upload = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "smartcampus/resources")
            );

            System.out.println("Cloudinary upload response: " + upload);

            Object secureUrl = upload.get("secure_url");
            if (secureUrl == null) {
                throw new RuntimeException("Cloudinary did not return secure_url");
            }

            return secureUrl.toString();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
        }
    }
}