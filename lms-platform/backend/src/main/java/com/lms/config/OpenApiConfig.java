package com.lms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "bearer-jwt";

    @Bean
    public OpenAPI lmsOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("LMS API")
                        .version("v1")
                        .description("Lead Management System — REST contracts for admin and mobile clients. "
                                + "Use POST /api/v1/auth/login to obtain a JWT, then Authorize with Bearer token."))
                .components(new Components().addSecuritySchemes(SECURITY_SCHEME_NAME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
