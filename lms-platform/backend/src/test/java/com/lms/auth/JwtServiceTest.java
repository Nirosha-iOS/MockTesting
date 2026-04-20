package com.lms.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        LmsAuthProperties props = new LmsAuthProperties(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                60_000L,
                "admin@lms.local",
                "x",
                "Admin",
                "LMS_ADMIN"
        );
        jwtService = new JwtService(props);
    }

    @Test
    void generateAndValidate() {
        String token = jwtService.generateToken("admin@lms.local", "LMS_ADMIN", "Admin");
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractSubject(token)).isEqualTo("admin@lms.local");
        assertThat(jwtService.extractRole(token)).isEqualTo("LMS_ADMIN");
    }
}
