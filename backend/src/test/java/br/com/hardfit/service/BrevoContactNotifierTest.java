package br.com.hardfit.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

class BrevoContactNotifierTest {
    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

    @Test
    void sendsAnInternalNotificationWithTheVisitorAsReplyTo() {
        server.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", "test-key"))
                .andExpect(jsonPath("$.sender.email").value("sender@example.com"))
                .andExpect(jsonPath("$.to[0].email").value("team@example.com"))
                .andExpect(jsonPath("$.replyTo.email").value("visitor@example.com"))
                .andExpect(jsonPath("$.textContent").value(
                        "Nome: Ana\nE-mail: visitor@example.com\n\nMensagem:\nQuero saber mais."))
                .andRespond(withStatus(HttpStatus.CREATED));

        notifier().notifyTeam("Ana", "visitor@example.com", "Quero saber mais.");

        server.verify();
    }

    @Test
    void doesNotPropagateARejectedNotification() {
        server.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        notifier().notifyTeam("Ana", "visitor@example.com", null);

        server.verify();
    }

    @Test
    void skipsNotificationWhenConfigurationIsMissing() {
        var notifier = new BrevoContactNotifier(builder.build(), "", "", "");

        notifier.notifyTeam("Ana", "visitor@example.com", null);

        server.verify();
    }

    private BrevoContactNotifier notifier() {
        return new BrevoContactNotifier(builder.build(), "test-key", "sender@example.com", "team@example.com");
    }
}
