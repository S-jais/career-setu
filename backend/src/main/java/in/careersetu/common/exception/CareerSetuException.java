package in.careersetu.common.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

/**
 * Base exception for all CareerSetu business exceptions.
 * Maps to structured API error responses.
 */
public class CareerSetuException extends RuntimeException {

    private final String code;
    private final HttpStatus httpStatus;
    private final List<String> details;

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public List<String> getDetails() {
        return details;
    }

    public CareerSetuException(String code, String message, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
        this.details = List.of();
    }

    public CareerSetuException(String code, String message, HttpStatus httpStatus, List<String> details) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
        this.details = details;
    }

    // ── Common exceptions ──────────────────────────────────────

    public static CareerSetuException notFound(String entity, String id) {
        return new CareerSetuException(
                entity.toUpperCase() + "_NOT_FOUND",
                entity + " not found: " + id,
                HttpStatus.NOT_FOUND
        );
    }

    public static CareerSetuException accessDenied(String reason) {
        return new CareerSetuException(
                "ACCESS_DENIED",
                reason,
                HttpStatus.FORBIDDEN
        );
    }

    public static CareerSetuException conflict(String code, String message) {
        return new CareerSetuException(code, message, HttpStatus.CONFLICT);
    }

    public static CareerSetuException badRequest(String code, String message) {
        return new CareerSetuException(code, message, HttpStatus.BAD_REQUEST);
    }

    public static CareerSetuException badRequest(String code, String message, List<String> details) {
        return new CareerSetuException(code, message, HttpStatus.BAD_REQUEST, details);
    }

    public static CareerSetuException eligibilityFailed(List<String> reasons) {
        return new CareerSetuException(
                "ELIGIBILITY_FAILED",
                "You are not eligible for this opportunity.",
                HttpStatus.FORBIDDEN,
                reasons
        );
    }

    public static CareerSetuException rateLimited() {
        return new CareerSetuException(
                "RATE_LIMIT_EXCEEDED",
                "Too many requests. Please try again later.",
                HttpStatus.TOO_MANY_REQUESTS
        );
    }

    public static CareerSetuException tenantMismatch() {
        return new CareerSetuException(
                "TENANT_MISMATCH",
                "You do not have access to resources in this tenant.",
                HttpStatus.FORBIDDEN
        );
    }
}
