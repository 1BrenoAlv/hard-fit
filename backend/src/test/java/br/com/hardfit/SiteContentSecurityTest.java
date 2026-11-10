package br.com.hardfit;

import br.com.hardfit.config.SecurityConfig;
import br.com.hardfit.controller.AdminController;
import br.com.hardfit.controller.SiteContentController;
import br.com.hardfit.model.SiteSettings;
import br.com.hardfit.service.SiteContentService;
import br.com.hardfit.service.SiteContentService.SiteContent;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({AdminController.class, SiteContentController.class})
@Import({SecurityConfig.class, SiteContentSecurityTest.TestUsers.class})
class SiteContentSecurityTest {
    private static final String SETTINGS_PATH = "/api/admin/settings";
    private static final String CSRF_PATH = "/api/admin/csrf";
    private static final String CHECKOUT = "https://pay.hotmart.com/EXEMPLO";

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private SiteContentService service;

    @Test
    void publicContentIsReadableWithoutLoginAndIsNotCached() throws Exception {
        when(service.getContent()).thenReturn(new SiteContent(
                new SiteSettings(CHECKOUT, null, null, null, null), List.of()));

        mvc.perform(get("/api/site-content"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.settings.hotmartUrl").value(CHECKOUT));
    }

    @Test
    void adminRejectsIncorrectPassword() throws Exception {
        mvc.perform(get(CSRF_PATH).with(httpBasic("admin", "incorrect")))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @CsvSource({
            "PUT, /api/admin/settings",
            "POST, /api/admin/evolutions",
            "PUT, /api/admin/evolutions/7eac69c0-f8a4-441e-97a2-62d96a0b32a5",
            "DELETE, /api/admin/evolutions/7eac69c0-f8a4-441e-97a2-62d96a0b32a5"
    })
    void adminWritesRequireAuthenticationEvenWithCsrfToken(String method, String path) throws Exception {
        mvc.perform(request(HttpMethod.valueOf(method), path).with(csrf()))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(service);
    }

    @Test
    void authenticatedWriteWithoutCsrfTokenIsForbidden() throws Exception {
        mvc.perform(put(SETTINGS_PATH).with(httpBasic("admin", "test-password")))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    void authenticatedWriteWithInvalidCsrfTokenIsForbidden() throws Exception {
        mvc.perform(put(SETTINGS_PATH).with(httpBasic("admin", "test-password"))
                        .with(csrf().useInvalidToken()))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @ParameterizedTest
    @ValueSource(strings = {"javascript:alert(1)", "http://pay.hotmart.com/EXEMPLO"})
    void unsafeCheckoutUrlIsRejected(String url) throws Exception {
        mvc.perform(put(SETTINGS_PATH).with(httpBasic("admin", "test-password")).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hotmartUrl\":\"" + url + "\"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    void authenticatedAdminCanWriteWithTokenFromTheSameSession() throws Exception {
        when(service.updateSettings(any(SiteSettings.class))).thenAnswer(call -> call.getArgument(0));
        var tokenResponse = mvc.perform(get(CSRF_PATH).with(httpBasic("admin", "test-password")))
                .andExpect(status().isOk())
                .andReturn();
        String tokenJson = tokenResponse.getResponse().getContentAsString();
        String headerName = JsonPath.read(tokenJson, "$.headerName");
        String token = JsonPath.read(tokenJson, "$.token");
        var session = (MockHttpSession) tokenResponse.getRequest().getSession(false);

        mvc.perform(put(SETTINGS_PATH).with(httpBasic("admin", "test-password"))
                        .session(session).header(headerName, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hotmartUrl\":\"" + CHECKOUT + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hotmartUrl").value(CHECKOUT));
    }

    @TestConfiguration
    @EnableWebSecurity
    static class TestUsers {
        @Bean
        InMemoryUserDetailsManager userDetailsService() {
            return new InMemoryUserDetailsManager(
                    User.withUsername("admin").password("{noop}test-password").roles("USER").build());
        }
    }
}
