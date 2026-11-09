package br.com.hardfit.model;

public final class ImageLocation {
    public static final String FILE_NAME = "[0-9a-f-]{36}\\.(?:jpg|png|webp)";
    public static final String URL_PATTERN = "https://[^\\s]+|/api/images/" + FILE_NAME;

    private ImageLocation() {
    }
}
