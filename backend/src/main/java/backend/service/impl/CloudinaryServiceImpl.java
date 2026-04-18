package backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map uploadFile(MultipartFile file) throws IOException {

        // ✅ IMPORTANT: allow optional file (DO NOT BREAK MEMBER 3)
        if (file == null || file.isEmpty()) {
            return null;
        }

        // ✅ Validate only if file exists
        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/jpeg")
               || contentType.equals("image/png")
               || contentType.equals("image/jpg"))) {
            throw new IllegalArgumentException("Only JPG and PNG allowed");
        }

        // ✅ Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", "smartcampus/resources"
                )
        );

        // ✅ Optional debug
        System.out.println("Cloudinary upload: " + uploadResult);

        return uploadResult;
    }
}