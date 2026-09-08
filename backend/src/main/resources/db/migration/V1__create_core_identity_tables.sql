-- ============================================================
-- CareerSetu — V1: Core Identity & RBAC Tables
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- ── User Roles Enum ─────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
    'STUDENT',
    'ALUMNI',
    'FACULTY',
    'MENTOR',
    'TPO',
    'DEPARTMENT_ADMIN',
    'INSTITUTION_ADMIN',
    'EMPLOYER',
    'RECRUITER',
    'RESEARCH_ORGANIZATION',
    'VERIFIER',
    'COMPLIANCE_OFFICER',
    'SCHEME_ADMIN',
    'PLATFORM_ADMIN',
    'SUPER_ADMIN'
);

-- ── User Account Status ──────────────────────────────────────
CREATE TYPE account_status AS ENUM (
    'PENDING_VERIFICATION',
    'ACTIVE',
    'SUSPENDED',
    'DEACTIVATED',
    'LOCKED'
);

-- ── Core Users Table ─────────────────────────────────────────
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    mobile              VARCHAR(20),
    password_hash       TEXT,                -- Argon2id hash; NULL if OIDC-only
    full_name           VARCHAR(255) NOT NULL,
    display_name        VARCHAR(100),
    profile_picture_key TEXT,               -- S3 object key
    primary_role        user_role NOT NULL DEFAULT 'STUDENT',
    account_status      account_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    email_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    mobile_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    oidc_provider       VARCHAR(50),        -- google, microsoft, etc.
    oidc_subject        VARCHAR(255),       -- external subject ID
    locale              VARCHAR(10) NOT NULL DEFAULT 'en',
    timezone            VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    last_login_at       TIMESTAMPTZ,
    last_login_ip       INET,
    failed_login_count  INTEGER NOT NULL DEFAULT 0,
    locked_until        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,        -- soft delete
    version             BIGINT NOT NULL DEFAULT 0  -- optimistic lock
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_mobile ON users(mobile) WHERE mobile IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_users_oidc ON users(oidc_provider, oidc_subject) WHERE oidc_provider IS NOT NULL;
CREATE INDEX idx_users_status ON users(account_status) WHERE deleted_at IS NULL;

-- ── User Roles (many-to-many for multi-role) ─────────────────
CREATE TABLE user_roles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       user_role NOT NULL,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- ── Tenant (Institution / Company) ──────────────────────────
CREATE TYPE tenant_type AS ENUM ('INSTITUTION', 'COMPANY', 'PLATFORM');

CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    type        tenant_type NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User-Tenant Memberships ──────────────────────────────────
CREATE TABLE user_tenant_memberships (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role        user_role NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at     TIMESTAMPTZ,
    UNIQUE(user_id, tenant_id, role)
);

CREATE INDEX idx_tenant_membership_user ON user_tenant_memberships(user_id);
CREATE INDEX idx_tenant_membership_tenant ON user_tenant_memberships(tenant_id);

-- ── MFA Factors ──────────────────────────────────────────────
CREATE TYPE mfa_type AS ENUM ('TOTP', 'SMS_OTP', 'EMAIL_OTP', 'PASSKEY', 'RECOVERY_CODE');

CREATE TABLE mfa_factors (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        mfa_type NOT NULL,
    secret      TEXT,                    -- encrypted TOTP secret
    name        VARCHAR(100),            -- user-defined device name
    is_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    last_used   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mfa_user ON mfa_factors(user_id);

-- ── Email Verification Tokens ─────────────────────────────────
CREATE TABLE email_verification_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL,           -- SHA-256 hash of the token
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_verify_token ON email_verification_tokens(token_hash);
CREATE INDEX idx_email_verify_user ON email_verification_tokens(user_id);

-- ── Password Reset Tokens ────────────────────────────────────
CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    request_ip  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pwd_reset_token ON password_reset_tokens(token_hash);

-- ── Refresh Tokens ────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    device_info     JSONB,
    ip_address      INET,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    revoke_reason   VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_token ON refresh_tokens(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id) WHERE revoked_at IS NULL;

-- ── Login History ─────────────────────────────────────────────
CREATE TABLE login_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_at       TIMESTAMPTZ,
    ip_address      INET,
    user_agent      TEXT,
    device_type     VARCHAR(50),
    status          VARCHAR(20) NOT NULL, -- SUCCESS, FAILED, MFA_REQUIRED, BLOCKED
    failure_reason  VARCHAR(100)
);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_time ON login_history(login_at DESC);

-- ── Audit Events ──────────────────────────────────────────────
CREATE TABLE audit_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id        UUID REFERENCES users(id),
    actor_role      TEXT,
    tenant_id       UUID REFERENCES tenants(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100),
    entity_id       UUID,
    request_id      VARCHAR(36),
    ip_address      INET,
    user_agent      TEXT,
    outcome         VARCHAR(20) NOT NULL, -- SUCCESS, FAILURE, BLOCKED
    details         JSONB,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_events(actor_id, occurred_at DESC);
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id, occurred_at DESC);
CREATE INDEX idx_audit_tenant ON audit_events(tenant_id, occurred_at DESC);
CREATE INDEX idx_audit_action ON audit_events(action, occurred_at DESC);

-- ── Security Events ────────────────────────────────────────────
CREATE TABLE security_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    event_type      VARCHAR(100) NOT NULL,
    severity        VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    ip_address      INET,
    user_agent      TEXT,
    details         JSONB,
    resolved_at     TIMESTAMPTZ,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON security_events(user_id, occurred_at DESC);
CREATE INDEX idx_security_events_type ON security_events(event_type, occurred_at DESC);
CREATE INDEX idx_security_events_severity ON security_events(severity) WHERE resolved_at IS NULL;

-- ── Updated_at trigger function ───────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
