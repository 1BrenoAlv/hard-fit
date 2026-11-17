package br.com.hardfit.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

class SendGridContactNotifierTest {
    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

    @Test
    void sendsAnInternalNotificationWithTheVisitorAsReplyTo() {
        server.expect(requestTo("https://api.sendgrid.com/v3/mail/send"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer test-key"))
                .andExpect(jsonPath("$.from.email").value("sender@example.com"))
                .andExpect(jsonPath("$.personalizations[0].to[0].email").value("team@example.com"))
                .andExpect(jsonPath("$.reply_to.email").value("visitor@example.com"))
                .andExpect(jsonPath("$.subject").value("Novo pedido de contato da HardFit"))
                .andExpect(jsonPath("$.content[0].type").value("text/plain"))
                .andExpect(jsonPath("$.content[0].value").value(
                        "Nome: Ana\nE-mail: visitor@example.com\n\nMensagem:\nQuero saber mais."))
                .andRespond(withStatus(HttpStatus.ACCEPTED));

        notifier().notifyTeam("Ana", "visitor@example.com", "Quero saber mais.");

        server.verify();
    }

    @Test
    void confirmsRegistrationWithPersonalizedHtmlAndInlineLogo() {
        server.expect(requestTo("https://api.sendgrid.com/v3/mail/send"))
                .andExpect(jsonPath("$.personalizations[0].to[0].email").value("visitor@example.com"))
                .andExpect(jsonPath("$.subject").value("Cadastro confirmado na HardFit"))
                .andExpect(jsonPath("$.content[0].type").value("text/plain"))
                .andExpect(jsonPath("$.content[1].type").value("text/html"))
                .andExpect(jsonPath("$.content[1].value").value(containsString("Olá, Ana &lt;3!")))
                .andExpect(jsonPath("$.content[1].value").value(containsString("será lançada em breve")))
                .andExpect(jsonPath("$.content[1].value").value(containsString("cid:hardfit-logo")))
                .andExpect(jsonPath("$.attachments[0].content_id").value("hardfit-logo"))
                .andExpect(jsonPath("$.attachments[0].disposition").value("inline"))
                .andExpect(jsonPath("$.attachments[0].content").isNotEmpty())
                .andRespond(withStatus(HttpStatus.ACCEPTED));

        var notifier = new SendGridContactNotifier(builder.build(), "test-key", "sender@example.com", "");
        notifier.confirmRegistration("Ana <3", "visitor@example.com");

        server.verify();
    }

    @Test
    void doesNotPropagateARejectedNotification() {
        server.expect(requestTo("https://api.sendgrid.com/v3/mail/send"))
                .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        notifier().notifyTeam("Ana", "visitor@example.com", null);

        server.verify();
    }

    @Test
    void skipsNotificationWhenConfigurationIsMissing() {
        var notifier = new SendGridContactNotifier(builder.build(), "", "", "");

        notifier.notifyTeam("Ana", "visitor@example.com", null);
        notifier.confirmRegistration("Ana", "visitor@example.com");

        server.verify();
    }

    private SendGridContactNotifier notifier() {
        return new SendGridContactNotifier(builder.build(), "test-key", "sender@example.com", "team@example.com");
    }
}
