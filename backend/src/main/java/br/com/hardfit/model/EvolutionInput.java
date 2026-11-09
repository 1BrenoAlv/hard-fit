package br.com.hardfit.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EvolutionInput(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String beforeImageUrl,
        @NotBlank @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String afterImageUrl
) {
}
