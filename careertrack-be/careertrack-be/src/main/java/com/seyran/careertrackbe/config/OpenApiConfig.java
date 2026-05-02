package com.seyran.careertrackbe.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Career Track API", version = "1.0", description = "İş Takip Uygulaması API Dokümantasyonu"),
        security = @SecurityRequirement(name = "bearerAuth") // Tüm endpointlere kilit ikonu ekler
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Token'ınızı girin (Başında 'Bearer ' yazmanıza gerek yok, sadece token'ı yapıştırın)",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // İçi boş kalabilir, sadece üstündeki notasyonlar Swagger'ı ayarlamak için yeterlidir.
}