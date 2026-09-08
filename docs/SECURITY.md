# CareerSetu — Security & Compliance Architecture

## 1. Regulatory Compliance (India-First)

### A. Digital Personal Data Protection Act (DPDP Act 2023)
- **Data Minimization**: Only information required for academic verification and job matching is requested.
- **Purpose Limitation**: Personal candidate data cannot be accessed by recruiters without explicit opt-in application submission.
- **Right to Erasure / Revocation**: Users can purge or anonymize their profile, disconnecting historical applications.
- **PII Guardrail**: Automatic masking of Aadhaar (12-digit UIDAI), PAN (10-char alphanumeric), phone numbers, and emails before LLM transmission.

### B. AICTE & UGC Internship Policy Alignment
- Structured internship tracking with dual sign-off (Faculty Mentor + Corporate Supervisor).
- Mandatory compliance fields: minimum stipend verification, credit framework mapping, safety declarations.

---

## 2. Authentication & Authorization

### Cryptographic Safeguards
- **Password Hashing**: Argon2id (`Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()`). Salt length 16 bytes, hash length 32 bytes, iterations 3, memory 65,536 KiB.
- **Token Signing**: HMAC-SHA512 with minimum 256-bit entropy keys.
- **Token Lifecycles**:
  - Access Token: 15 minutes (stateless JWT).
  - Refresh Token: 7 days (opaque token, hashed in persistent storage, revocable).

### Defense Against Common Attacks
- **Brute Force Defense**: Account lockout for 15 minutes after 5 consecutive failed attempts.
- **Timing Attacks**: Constant-time credential comparison in Spring Security.
- **User Enumeration**: Uniform generic response for forgot-password and credential validation.
- **Injection Defense**: Parameterized JPA queries with Hibernate; prompt injection filtering in AI service.
- **CSRF / XSS**: Strict Content Security Policy (CSP), HTTP-only cookies, no raw HTML interpolation.
