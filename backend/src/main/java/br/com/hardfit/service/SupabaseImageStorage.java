package br.com.hardfit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.time.Duration;

@Component
public class SupabaseImageStorage {
    private final String baseUrl;
    private final String bucket;
    private final RestClient client;

    public SupabaseImageStorage(
            @Value("${hardfit.supabase.url}") String url,
            @Value("${hardfit.supabase.service-role-key}") String serviceRoleKey,
            @Value("${hardfit.supabase.bucket}") String bucket
    ) {
        this.bucket = bucket;
        baseUrl = url.strip().replaceFirst("/+$", "");
        if (baseUrl.isEmpty()) {
            client = null;
            return;
        }

        URI projectUrl = URI.create(baseUrl);
        if (!"https".equalsIgnoreCase(projectUrl.getScheme()) || projectUrl.getHost() == null
                || projectUrl.getUserInfo() != null || !projectUrl.getPath().isEmpty()
                || projectUrl.getQuery() != null || projectUrl.getFragment() != null
                || serviceRoleKey.isBlank() || !bucket.matches("[a-z0-9][a-z0-9-]*")) {
            throw new IllegalStateException("Confira a URL, a chave e o bucket do Supabase Storage.");
        }

        var requestFactory = new JdkClientHttpRequestFactory(HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8)).build());
        requestFactory.setReadTimeout(Duration.ofSeconds(25));
        client = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader("apikey", serviceRoleKey)
                .defaultHeaders(headers -> headers.setBearerAuth(serviceRoleKey))
                .build();
    }

    public boolean isConfigured() {
        return client != null;
    }

    public String upload(String filename, MediaType contentType, byte[] bytes) {
        var file = new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        };
        var fileHeaders = new HttpHeaders();
        fileHeaders.setContentType(contentType);
        var form = new LinkedMultiValueMap<String, Object>();
        form.add("cacheControl", "86400");
        form.add("file", new HttpEntity<>(file, fileHeaders));
        try {
            client.post()
                    .uri("/storage/v1/object/{bucket}/{filename}", bucket, filename)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível salvar a imagem no Supabase.");
        }
        return baseUrl + "/storage/v1/object/public/" + bucket + "/" + filename;
    }
}
