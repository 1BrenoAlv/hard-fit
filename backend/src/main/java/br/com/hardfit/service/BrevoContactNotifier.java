package br.com.hardfit.service;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
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
public class BrevoContactNotifier {
    private static final Logger logger = LoggerFactory.getLogger(BrevoContactNotifier.class);

    private final RestClient client;
    private final String apiKey;
    private final String senderEmail;
    private final String recipientEmail;

    @Autowired
    public BrevoContactNotifier(
            @Value("${BREVO_API_KEY:}") String apiKey,
            @Value("${BREVO_SENDER_EMAIL:}") String senderEmail,
            @Value("${HARDFIT_CONTACT_EMAIL:}") String recipientEmail) {
        this(createClient(), apiKey, senderEmail, recipientEmail);
    }

    BrevoContactNotifier(RestClient client, String apiKey, String senderEmail, String recipientEmail) {
        this.client = client;
        this.apiKey = apiKey.strip();
        this.senderEmail = senderEmail.strip();
        this.recipientEmail = recipientEmail.strip();

        if (!enabled() && !(this.apiKey.isEmpty() && this.senderEmail.isEmpty() && this.recipientEmail.isEmpty())) {
            logger.warn("Notificações de contato desativadas. Preencha as três variáveis de e-mail.");
        }
    }

    public void notifyTeam(String name, String email, String message) {
        if (!enabled()) {
            return;
        }

        String text = "Nome: " + name + "\nE-mail: " + email;
        if (message != null) {
            text += "\n\nMensagem:\n" + message;
        }

        try {
            client.post()
                    .uri("https://api.brevo.com/v3/smtp/email")
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "sender", Map.of("email", senderEmail, "name", "HardFit"),
                            "to", List.of(Map.of("email", recipientEmail)),
                            "replyTo", Map.of("email", email),
                            "subject", "Novo pedido de contato da HardFit",
                            "textContent", text))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            logger.warn("Pedido salvo. O Brevo recusou o aviso com status {}.", exception.getStatusCode().value());
        } catch (RestClientException exception) {
            logger.warn("Pedido salvo. Não foi possível enviar o aviso ao Brevo.");
        }
    }

    private boolean enabled() {
        return !apiKey.isEmpty() && !senderEmail.isEmpty() && !recipientEmail.isEmpty();
    }

    private static RestClient createClient() {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(4));
        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
