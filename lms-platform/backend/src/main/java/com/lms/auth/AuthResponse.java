package com.lms.auth;

public record AuthResponse(
        String accessToken,
        long expiresInSeconds,
        AuthUserProfile user
) {
}
