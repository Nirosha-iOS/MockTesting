package com.lms.auth;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final LmsAuthProperties properties;
    private final JwtService jwtService;

    public AuthService(LmsAuthProperties properties, JwtService jwtService) {
        this.properties = properties;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        if (!properties.demoEmail().equalsIgnoreCase(request.email().trim())
                || !properties.demoPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtService.generateToken(
                properties.demoEmail(),
                properties.demoRole(),
                properties.demoDisplayName()
        );
        long seconds = Math.max(1L, properties.jwtExpirationMs() / 1000);
        AuthUserProfile user = new AuthUserProfile(
                properties.demoEmail(),
                properties.demoDisplayName(),
                properties.demoRole()
        );
        return new AuthResponse(token, seconds, user);
    }
}
