package br.com.hardfit.service;

import br.com.hardfit.model.Evolution;
import br.com.hardfit.model.EvolutionInput;
import br.com.hardfit.model.SiteSettings;
import br.com.hardfit.repository.SiteContentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class SiteContentService {
    private final SiteContentRepository repository;

    public SiteContentService(SiteContentRepository repository) {
        this.repository = repository;
    }

    public SiteContent getContent() {
        return new SiteContent(repository.findSettings(), repository.findEvolutions());
    }

    public SiteSettings updateSettings(SiteSettings settings) {
        repository.updateSettings(settings);
        return settings;
    }

    public Evolution createEvolution(EvolutionInput input) {
        Evolution evolution = toEvolution(UUID.randomUUID(), input);
        repository.insertEvolution(evolution);
        return evolution;
    }

    public Evolution updateEvolution(UUID id, EvolutionInput input) {
        Evolution evolution = toEvolution(id, input);
        if (!repository.updateEvolution(evolution)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evolução não encontrada");
        }
        return evolution;
    }

    public void deleteEvolution(UUID id) {
        if (!repository.deleteEvolution(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evolução não encontrada");
        }
    }

    private Evolution toEvolution(UUID id, EvolutionInput input) {
        return new Evolution(id, input.title().strip(), input.beforeImageUrl(), input.afterImageUrl());
    }

    public record SiteContent(SiteSettings settings, List<Evolution> evolutions) {
    }
}
