package com.lms.auth;

public record AuthUserProfile(
        String email,
        String displayName,
        String role
) {
}
