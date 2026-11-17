package br.com.hardfit;

import br.com.hardfit.controller.ContactRequestController;
import br.com.hardfit.service.SendGridContactNotifier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactRequestController.class)
class ContactRequestControllerTest {
    private static final String CONTACT_REQUESTS_URL = "/api/contact-requests";

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private JdbcTemplate jdbcTemplate;

    @MockitoBean
    private SendGridContactNotifier contactNotifier;

    @Test
    void createsContactRequestWithoutExposingItsData() throws Exception {
        mvc.perform(post(CONTACT_REQUESTS_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":" Ana D'Ávila ","email":"ana@example.com","message":" Quero saber mais. "}
                                """))
                .andExpect(status().isCreated())
                .andExpect(content().string(""));

        var savedThenNotified = inOrder(jdbcTemplate, contactNotifier);
        savedThenNotified.verify(jdbcTemplate).update(
                eq("INSERT INTO contact_requests (name, email, message) VALUES (?, ?, ?)"),
                eq("Ana D'Ávila"), eq("ana@example.com"), eq("Quero saber mais."));
        savedThenNotified.verify(contactNotifier)
                .notifyTeam("Ana D'Ávila", "ana@example.com", "Quero saber mais.");
        savedThenNotified.verify(contactNotifier).confirmRegistration("Ana D'Ávila", "ana@example.com");
    }

    @Test
    void acceptsContactRequestWithoutMessage() throws Exception {
        mvc.perform(post(CONTACT_REQUESTS_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ana","email":"ana@example.com"}
                                """))
                .andExpect(status().isCreated());

        verify(jdbcTemplate).update(anyString(), eq("Ana"), eq("ana@example.com"), isNull());
    }

    @Test
    void rejectsInvalidContactDetails() throws Exception {
        mvc.perform(post(CONTACT_REQUESTS_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ana","email":"invalido"}
                                """))
                .andExpect(status().isBadRequest());

        mvc.perform(post(CONTACT_REQUESTS_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"  ","email":"ana@example.com"}
                                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(jdbcTemplate);
        verifyNoInteractions(contactNotifier);
    }

    @Test
    void doesNotListContactRequests() throws Exception {
        mvc.perform(get(CONTACT_REQUESTS_URL)).andExpect(status().isMethodNotAllowed());

        verifyNoInteractions(jdbcTemplate);
    }
}
