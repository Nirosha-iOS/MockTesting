package com.lms.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "lms.auth")
public record LmsAuthProperties(
        String jwtSecret,
        long jwtExpirationMs,
        String demoEmail,
        String demoPassword,
        String demoDisplayName,
        String demoRole
) {
}
