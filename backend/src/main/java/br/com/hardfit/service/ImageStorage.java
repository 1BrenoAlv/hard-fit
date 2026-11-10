package br.com.hardfit.service;

import br.com.hardfit.model.ImageLocation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaTypeFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

@Service
public class ImageStorage {
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;

    private final Path uploadDirectory;
    private final SupabaseImageStorage supabase;

    public ImageStorage(@Value("${hardfit.upload-directory}") String uploadDirectory, SupabaseImageStorage supabase) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
        this.supabase = supabase;
    }

    public String save(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Escolha uma imagem.");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE, "A imagem deve ter até 5 MB.");
        }

        byte[] bytes = file.getBytes();
        String filename = UUID.randomUUID() + "." + imageExtension(bytes);
        if (supabase.isConfigured()) {
            return supabase.upload(filename, MediaTypeFactory.getMediaType(filename).orElseThrow(), bytes);
        }
        Files.createDirectories(uploadDirectory);
        Files.write(uploadDirectory.resolve(filename), bytes, StandardOpenOption.CREATE_NEW);
        return "/api/images/" + filename;
    }

    public Resource read(String filename) {
        if (!filename.matches(ImageLocation.FILE_NAME)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Path image = uploadDirectory.resolve(filename);
        if (!Files.isRegularFile(image)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new FileSystemResource(image);
    }

    private String imageExtension(byte[] bytes) {
        if (hasSignature(bytes, 0, 0xff, 0xd8, 0xff)) {
            return "jpg";
        }
        if (hasSignature(bytes, 0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
            return "png";
        }
        if (hasSignature(bytes, 0, 'R', 'I', 'F', 'F') && hasSignature(bytes, 8, 'W', 'E', 'B', 'P')) {
            return "webp";
        }
        throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Use uma imagem JPG, PNG ou WebP.");
    }

    private boolean hasSignature(byte[] bytes, int offset, int... signature) {
        if (bytes.length < offset + signature.length) {
            return false;
        }
        for (int index = 0; index < signature.length; index++) {
            if (Byte.toUnsignedInt(bytes[offset + index]) != signature[index]) {
                return false;
            }
        }
        return true;
    }
}
