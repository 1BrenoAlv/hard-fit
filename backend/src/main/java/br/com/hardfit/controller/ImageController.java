package br.com.hardfit.controller;

import br.com.hardfit.service.ImageStorage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;

@RestController
@Tag(name = "Imagens")
public class ImageController {
    private final ImageStorage storage;

    public ImageController(ImageStorage storage) {
        this.storage = storage;
    }

    @PostMapping(value = "/api/admin/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Enviar uma imagem JPG, PNG ou WebP de até 5 MB")
    @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER, required = true,
            description = "Token retornado por GET /api/admin/csrf na mesma sessão.")
    public UploadedImage upload(@RequestPart("file") MultipartFile file) throws IOException {
        return new UploadedImage(storage.save(file));
    }

    @GetMapping("/api/images/{filename}")
    public ResponseEntity<Resource> read(@PathVariable String filename) {
        Resource image = storage.read(filename);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
                .contentType(MediaTypeFactory.getMediaType(image).orElseThrow())
                .body(image);
    }

    public record UploadedImage(String url) {
    }
}
