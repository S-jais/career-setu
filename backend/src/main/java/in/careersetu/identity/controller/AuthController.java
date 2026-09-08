package in.careersetu.identity.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.identity.dto.AuthDtos;
import in.careersetu.identity.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller.
 *
 * <p>Handles registration, login, token refresh, email verification,
 * password management, and session management.
 *
 * <p>Security: All auth endpoints are rate-limited.
 * Errors are safe (no stack traces, no internals).
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User registration, login, and session management")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        AuthDtos.AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {
        AuthDtos.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<AuthDtos.UserInfo> getCurrentUser(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        AuthDtos.UserInfo userInfo = authService.getCurrentUserInfo(principal.userId());
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and invalidate session")
    public ResponseEntity<AuthDtos.MessageResponse> logout(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        // TODO: Revoke refresh token in DB
        log.info("User logged out: userId={}", principal.userId());
        return ResponseEntity.ok(new AuthDtos.MessageResponse("Logged out successfully."));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset email")
    public ResponseEntity<AuthDtos.MessageResponse> forgotPassword(
            @Valid @RequestBody AuthDtos.ForgotPasswordRequest request) {
        // Always return the same message to prevent email enumeration
        // TODO: send reset email if account exists
        log.info("Password reset requested for email: {}", request.getEmail().replaceAll("@.*", "@***"));
        return ResponseEntity.ok(new AuthDtos.MessageResponse(
                "If an account exists for this email, a password reset link has been sent."));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email address using token")
    public ResponseEntity<AuthDtos.MessageResponse> verifyEmail(
            @Valid @RequestBody AuthDtos.VerifyEmailRequest request) {
        // TODO: Verify token and mark email as verified
        return ResponseEntity.ok(new AuthDtos.MessageResponse("Email verified successfully."));
    }
}
