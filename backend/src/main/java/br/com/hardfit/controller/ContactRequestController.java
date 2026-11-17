package br.com.hardfit.controller;

import br.com.hardfit.service.SendGridContactNotifier;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContactRequestController {
    private final JdbcTemplate jdbcTemplate;
    private final SendGridContactNotifier contactNotifier;

    public ContactRequestController(JdbcTemplate jdbcTemplate, SendGridContactNotifier contactNotifier) {
        this.jdbcTemplate = jdbcTemplate;
        this.contactNotifier = contactNotifier;
    }

    @PostMapping(path = "/api/contact-requests", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody ContactRequest request) {
        String name = request.name().strip();
        String email = request.email().strip();
        String message = request.message() == null || request.message().isBlank()
                ? null
                : request.message().strip();

        jdbcTemplate.update(
                "INSERT INTO contact_requests (name, email, message) VALUES (?, ?, ?)",
                name,
                email,
                message);

        contactNotifier.notifyTeam(name, email, message);
        contactNotifier.confirmRegistration(name, email);
    }

    public record ContactRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email @Size(max = 254) String email,
            @Size(max = 1000) String message
    ) {}
}
