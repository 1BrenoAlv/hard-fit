package br.com.hardfit.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.HtmlUtils;

@Service
public class SendGridContactNotifier {
    private static final Logger logger = LoggerFactory.getLogger(SendGridContactNotifier.class);

    private final RestClient client;
    private final String apiKey;
    private final String senderEmail;
    private final String recipientEmail;
    private final String confirmationTemplate;
    private final String logoContent;

    @Autowired
    public SendGridContactNotifier(
            @Value("${SENDGRID_API_KEY:}") String apiKey,
            @Value("${SENDGRID_SENDER_EMAIL:}") String senderEmail,
            @Value("${HARDFIT_CONTACT_EMAIL:}") String recipientEmail) {
        this(createClient(), apiKey, senderEmail, recipientEmail);
    }

    SendGridContactNotifier(RestClient client, String apiKey, String senderEmail, String recipientEmail) {
        this.client = client;
        this.apiKey = apiKey.strip();
        this.senderEmail = senderEmail.strip();
        this.recipientEmail = recipientEmail.strip();
        this.confirmationTemplate = new String(
                readResource("email/launch-confirmation.html"),
                StandardCharsets.UTF_8);
        this.logoContent = Base64.getEncoder().encodeToString(readResource("email/hardfit-logo.png"));

        if (this.apiKey.isEmpty() != this.senderEmail.isEmpty()) {
            logger.warn("Envio de e-mails desativado. Configure a chave e o remetente do SendGrid.");
        }
    }

    public void notifyTeam(String name, String email, String message) {
        if (!enabled() || recipientEmail.isEmpty()) {
            return;
        }

        String text = "Nome: " + name + "\nE-mail: " + email;
        if (message != null) {
            text += "\n\nMensagem:\n" + message;
        }

        send(recipientEmail, "Novo pedido de contato da HardFit", Map.of(
                "reply_to", Map.of("email", email),
                "content", List.of(Map.of("type", "text/plain", "value", text))));
    }

    public void confirmRegistration(String name, String email) {
        if (!enabled()) {
            return;
        }

        String text = "Olá, " + name + "!\n\nRecebemos seu cadastro. "
                + "A mentoria de musculação da HardFit será lançada em breve.\n\nEquipe HardFit";
        String html = confirmationTemplate.replace("{{clientName}}", HtmlUtils.htmlEscape(name, "UTF-8"));

        send(email, "Cadastro confirmado na HardFit", Map.of(
                "content", List.of(
                        Map.of("type", "text/plain", "value", text),
                        Map.of("type", "text/html", "value", html)),
                "attachments", List.of(Map.of(
                        "content", logoContent,
                        "type", "image/png",
                        "filename", "hardfit-logo.png",
                        "disposition", "inline",
                        "content_id", "hardfit-logo"))));
    }

    private void send(String to, String subject, Map<String, Object> details) {
        var payload = new HashMap<>(details);
        payload.put("personalizations", List.of(Map.of("to", List.of(Map.of("email", to)))));
        payload.put("from", Map.of("email", senderEmail, "name", "HardFit"));
        payload.put("subject", subject);

        try {
            client.post()
                    .uri("https://api.sendgrid.com/v3/mail/send")
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            logger.warn(
                    "Pedido salvo. O SendGrid recusou o e-mail '{}' com status {}.",
                    subject,
                    exception.getStatusCode().value());
        } catch (RestClientException exception) {
            logger.warn("Pedido salvo. Não foi possível enviar o e-mail '{}' pelo SendGrid.", subject);
        }
    }

    private boolean enabled() {
        return !apiKey.isEmpty() && !senderEmail.isEmpty();
    }

    private static byte[] readResource(String path) {
        try {
            return new ClassPathResource(path).getContentAsByteArray();
        } catch (IOException exception) {
            throw new UncheckedIOException("Não foi possível carregar o recurso de e-mail " + path, exception);
        }
    }

    private static RestClient createClient() {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(4));
        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
