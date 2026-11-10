package br.com.hardfit.controller;

import br.com.hardfit.service.SiteContentService;
import br.com.hardfit.service.SiteContentService.SiteContent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Conteúdo público")
public class SiteContentController {
    private final SiteContentService service;

    public SiteContentController(SiteContentService service) {
        this.service = service;
    }

    @GetMapping("/api/site-content")
    @Operation(summary = "Consultar as configurações e evoluções do site")
    public ResponseEntity<SiteContent> getContent() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.getContent());
    }
}
