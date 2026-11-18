package br.com.hardfit.service;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Service
public class EmailJsContactNotifier {
    private static final Logger logger = LoggerFactory.getLogger(EmailJsContactNotifier.class);

    private final RestClient client;
    private final String serviceId;
    private final String templateId;
    private final String publicKey;
    private final String privateKey;
    private final boolean enabled;

    @Autowired
    public EmailJsContactNotifier(
            @Value("${EMAILJS_SERVICE_ID:}") String serviceId,
            @Value("${EMAILJS_TEMPLATE_ID:}") String templateId,
            @Value("${EMAILJS_PUBLIC_KEY:}") String publicKey,
            @Value("${EMAILJS_PRIVATE_KEY:}") String privateKey) {
        this(createClient(), serviceId, templateId, publicKey, privateKey);
    }

    EmailJsContactNotifier(RestClient client, String serviceId, String templateId, String publicKey, String privateKey) {
        this.client = client;
        this.serviceId = serviceId.strip();
        this.templateId = templateId.strip();
        this.publicKey = publicKey.strip();
        this.privateKey = privateKey.strip();
        this.enabled = !this.serviceId.isEmpty() && !this.templateId.isEmpty()
                && !this.publicKey.isEmpty() && !this.privateKey.isEmpty();

        if (!enabled && !(this.serviceId.isEmpty() && this.templateId.isEmpty()
                && this.publicKey.isEmpty() && this.privateKey.isEmpty())) {
            logger.warn("Envio de e-mails desativado. Verifique as variáveis do EmailJS.");
        }
    }

    public void confirmRegistration(String name, String email, String message) {
        if (!enabled) {
            return;
        }

        var payload = Map.of(
                "service_id", serviceId,
                "template_id", templateId,
                "user_id", publicKey,
                "accessToken", privateKey,
                "template_params", Map.of(
                        "clientName", name,
                        "clientEmail", email,
                        "message", message == null ? "" : message));

        try {
            client.post()
                    .uri("https://api.emailjs.com/api/v1.0/email/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            logger.warn("Pedido salvo. O EmailJS recusou a confirmação com status {}.",
                    exception.getStatusCode().value());
        } catch (RestClientException exception) {
            logger.warn("Pedido salvo. Não foi possível enviar a confirmação pelo EmailJS.");
        }
    }

    private static RestClient createClient() {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(4));
        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
