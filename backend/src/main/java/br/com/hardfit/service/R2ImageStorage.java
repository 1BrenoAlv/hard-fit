package br.com.hardfit.service;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.time.Duration;

@Component
public class R2ImageStorage {
    private final String bucket;
    private final String publicBaseUrl;
    private final S3Client client;

    public R2ImageStorage(
            @Value("${hardfit.r2.endpoint}") String endpoint,
            @Value("${hardfit.r2.access-key-id}") String accessKeyId,
            @Value("${hardfit.r2.secret-access-key}") String secretAccessKey,
            @Value("${hardfit.r2.bucket}") String bucket,
            @Value("${hardfit.r2.public-base-url}") String publicBaseUrl,
            @Value("${hardfit.r2.required:false}") boolean required
    ) {
        this.bucket = bucket.strip();
        this.publicBaseUrl = publicBaseUrl.strip().replaceFirst("/+$", "");
        boolean emptyConfiguration = endpoint.isBlank() && accessKeyId.isBlank()
                && secretAccessKey.isBlank() && publicBaseUrl.isBlank();
        if (!required && emptyConfiguration) {
            client = null;
            return;
        }

        if (accessKeyId.isBlank() || secretAccessKey.isBlank()
                || !this.bucket.matches("[a-z0-9][a-z0-9-]{1,61}[a-z0-9]")) {
            throw new IllegalStateException("Preencha as credenciais e o nome do bucket do Cloudflare R2.");
        }

        URI endpointUrl = httpsUrl(endpoint, "R2_ENDPOINT");
        if (!endpointUrl.getPath().isEmpty() && !"/".equals(endpointUrl.getPath())) {
            throw new IllegalStateException("R2_ENDPOINT deve conter apenas a URL da API S3 da conta.");
        }
        httpsUrl(this.publicBaseUrl, "R2_PUBLIC_BASE_URL");

        client = S3Client.builder()
                .endpointOverride(endpointUrl)
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId.strip(), secretAccessKey.strip())))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .chunkedEncodingEnabled(false)
                        .build())
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .overrideConfiguration(config -> config.apiCallTimeout(Duration.ofSeconds(25)))
                .build();
    }

    public boolean isConfigured() {
        return client != null;
    }

    public String upload(String filename, MediaType contentType, byte[] bytes) {
        var request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(filename)
                .contentType(contentType.toString())
                .cacheControl("public, max-age=86400")
                .build();
        try {
            client.putObject(request, RequestBody.fromBytes(bytes));
        } catch (SdkException error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível salvar a imagem no Cloudflare R2.", error);
        }
        return publicBaseUrl + "/" + filename;
    }

    @PreDestroy
    public void close() {
        if (client != null) {
            client.close();
        }
    }

    private URI httpsUrl(String value, String variable) {
        URI url = URI.create(value.strip());
        if (!"https".equalsIgnoreCase(url.getScheme()) || url.getHost() == null
                || url.getUserInfo() != null || url.getQuery() != null || url.getFragment() != null) {
            throw new IllegalStateException(variable + " deve conter uma URL HTTPS válida.");
        }
        return url;
    }
}
