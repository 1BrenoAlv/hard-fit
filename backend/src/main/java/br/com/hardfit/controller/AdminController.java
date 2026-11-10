package br.com.hardfit.controller;

import br.com.hardfit.model.Evolution;
import br.com.hardfit.model.EvolutionInput;
import br.com.hardfit.model.SiteSettings;
import br.com.hardfit.service.SiteContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administração", description = "Rotas protegidas. Veja o exemplo de acesso administrativo no README.")
public class AdminController {
    private static final String CSRF_DESCRIPTION = "Token retornado por GET /api/admin/csrf na mesma sessão.";

    private final SiteContentService service;

    public AdminController(SiteContentService service) {
        this.service = service;
    }

    @GetMapping("/csrf")
    @Operation(summary = "Obter o token CSRF para alterações")
    public CsrfToken getCsrfToken(@Parameter(hidden = true) CsrfToken csrfToken) {
        return csrfToken;
    }

    @PutMapping("/settings")
    @Operation(summary = "Substituir as configurações do site")
    @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER, required = true, description = CSRF_DESCRIPTION)
    public SiteSettings updateSettings(@Valid @RequestBody SiteSettings settings) {
        return service.updateSettings(settings);
    }

    @PostMapping("/evolutions")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastrar um comparativo")
    @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER, required = true, description = CSRF_DESCRIPTION)
    public Evolution createEvolution(@Valid @RequestBody EvolutionInput evolution) {
        return service.createEvolution(evolution);
    }

    @PutMapping("/evolutions/{id}")
    @Operation(summary = "Editar um comparativo")
    @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER, required = true, description = CSRF_DESCRIPTION)
    public Evolution updateEvolution(@PathVariable UUID id, @Valid @RequestBody EvolutionInput evolution) {
        return service.updateEvolution(id, evolution);
    }

    @DeleteMapping("/evolutions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remover um comparativo")
    @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER, required = true, description = CSRF_DESCRIPTION)
    public void deleteEvolution(@PathVariable UUID id) {
        service.deleteEvolution(id);
    }
}
