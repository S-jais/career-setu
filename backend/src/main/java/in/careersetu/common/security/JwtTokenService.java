package in.careersetu.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

/**
 * JWT Token Service — generates and validates access/refresh tokens.
 *
 * <p>Access tokens: short-lived (15 min default), stateless JWT.
 * Refresh tokens: longer-lived (7 days), stored hash in DB for revocation.
 * Sensitive operations require re-authentication regardless of token validity.
 */
@Component
public class JwtTokenService {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);

    private final SecretKey signingKey;
    private final long accessTokenExpiryMinutes;
    private final long refreshTokenExpiryDays;

    public JwtTokenService(
            @Value("${careersetu.jwt.secret}") String jwtSecret,
            @Value("${careersetu.jwt.access-token-expiry-minutes:15}") long accessTokenExpiryMinutes,
            @Value("${careersetu.jwt.refresh-token-expiry-days:7}") long refreshTokenExpiryDays) {
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 256 bits (32 characters)");
        }
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiryMinutes = accessTokenExpiryMinutes;
        this.refreshTokenExpiryDays = refreshTokenExpiryDays;
    }

    public String generateAccessToken(UUID userId, String email, String primaryRole,
                                       List<String> roles, UUID tenantId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(accessTokenExpiryMinutes * 60);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("primary_role", primaryRole)
                .claim("roles", roles)
                .claim("tenant_id", tenantId != null ? tenantId.toString() : null)
                .claim("token_type", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .id(UUID.randomUUID().toString())
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();
    }

    public String generateRefreshToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(refreshTokenExpiryDays * 24 * 3600);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("token_type", "refresh")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .id(UUID.randomUUID().toString())
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();
    }

    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Optional<Claims> tryValidateToken(String token) {
        try {
            return Optional.of(validateAndExtractClaims(token));
        } catch (ExpiredJwtException e) {
            log.debug("JWT token expired");
            return Optional.empty();
        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public boolean isAccessToken(Claims claims) {
        return "access".equals(claims.get("token_type", String.class));
    }

    public boolean isRefreshToken(Claims claims) {
        return "refresh".equals(claims.get("token_type", String.class));
    }

    public UUID extractUserId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(Claims claims) {
        Object roles = claims.get("roles");
        if (roles instanceof List<?>) {
            return (List<String>) roles;
        }
        return Collections.emptyList();
    }
}
