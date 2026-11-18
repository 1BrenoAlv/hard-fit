package br.com.hardfit.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

class EmailJsContactNotifierTest {
    private static final String SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

    @Test
    void sendsRegistrationThroughTheConfiguredTemplate() {
        server.expect(requestTo(SEND_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.service_id").value("service_test"))
                .andExpect(jsonPath("$.template_id").value("template_test"))
                .andExpect(jsonPath("$.user_id").value("public_test"))
                .andExpect(jsonPath("$.accessToken").value("private_test"))
                .andExpect(jsonPath("$.template_params.clientEmail").value("visitor@example.com"))
                .andExpect(jsonPath("$.template_params.clientName").value("Ana <3"))
                .andExpect(jsonPath("$.template_params.message").value("Quero saber mais."))
                .andRespond(withStatus(HttpStatus.OK));

        notifier().confirmRegistration("Ana <3", "visitor@example.com", "Quero saber mais.");

        server.verify();
    }

    @Test
    void doesNotPropagateARejectedConfirmationWithoutAnOptionalMessage() {
        server.expect(requestTo(SEND_URL))
                .andExpect(jsonPath("$.template_params.message").value(""))
                .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        notifier().confirmRegistration("Ana", "visitor@example.com", null);

        server.verify();
    }

    @Test
    void skipsConfirmationWhenThePrivateKeyIsMissing() {
        var notifier = new EmailJsContactNotifier(builder.build(), "service_test", "template_test", "public_test", "");

        notifier.confirmRegistration("Ana", "visitor@example.com", null);

        server.verify();
    }

    private EmailJsContactNotifier notifier() {
        return new EmailJsContactNotifier(builder.build(), "service_test", "template_test", "public_test", "private_test");
    }
}
