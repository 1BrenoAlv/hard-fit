package br.com.hardfit.model;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record SiteSettings(
        @URL(protocol = "https") @Size(max = 2048) String hotmartUrl,
        @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String heroImageUrl,
        @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String fatLossImageUrl,
        @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String strengthImageUrl,
        @Pattern(regexp = ImageLocation.URL_PATTERN) @Size(max = 2048) String consistencyImageUrl
) {
}
