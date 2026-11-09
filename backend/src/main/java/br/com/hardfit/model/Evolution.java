package br.com.hardfit.model;

import java.util.UUID;

public record Evolution(UUID id, String title, String beforeImageUrl, String afterImageUrl) {
}
