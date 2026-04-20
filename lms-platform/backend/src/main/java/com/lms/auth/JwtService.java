package com.lms.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final LmsAuthProperties properties;

    public JwtService(LmsAuthProperties properties) {
        this.properties = properties;
    }

    public String generateToken(String subject, String role, String displayName) {
        long now = System.currentTimeMillis();
        Date issued = new Date(now);
        Date expiry = new Date(now + properties.jwtExpirationMs());
        return Jwts.builder()
                .subject(subject)
                .issuedAt(issued)
                .expiration(expiry)
                .claims(Map.of(
                        "role", role,
                        "name", displayName
                ))
                .signWith(signingKey())
                .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    public String extractRole(String token) {
        Object r = parseClaims(token).get("role");
        return r == null ? "" : r.toString();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        byte[] keyBytes = properties.jwtSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
