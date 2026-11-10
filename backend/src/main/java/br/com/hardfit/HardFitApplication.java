package br.com.hardfit;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "HardFit API", version = "v1",
        description = "Conteúdo público e operações administrativas da HardFit."))
public class HardFitApplication {
    public static void main(String[] args) {
        SpringApplication.run(HardFitApplication.class, args);
    }
}
