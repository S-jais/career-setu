# CareerSetu — Technical Architecture

## 1. Architectural Philosophy
CareerSetu is built on a modern **Hybrid Polyglot Micro-Architecture**:
1. **Core Business & Sovereign Identity Plane**: Java 25 + Spring Boot 3/4 (enterprise reliability, ACID transactional consistency, Argon2id security, Flyway database evolutions, enterprise compliance).
2. **AI & Skill Intelligence Plane**: Python 3.13 + FastAPI (asynchronous I/O, rapid vector & LLM orchestration, model integration, explainable heuristics).
3. **Reactive Presentation Plane**: React 19 + TypeScript + Tailwind CSS (fluid 60fps micro-interactions, responsive design, dark/light token system, WCAG accessible).

---

## 2. Multi-Tier System Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                   │
│  React 19 SPA (Student / TPO / Recruiter / Faculty / Admin Portals)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / WSS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API Gateway & Reverse Proxy                        │
│             Nginx (Rate Limiting, TLS Termination, Gzip/Brotli)            │
└──────────────┬───────────────────────────────────────────────┬──────────────┘
               │ /api/v1/auth, /api/v1/students, etc.          │ /api/v1/ai/*
               ▼                                               ▼
┌──────────────────────────────────────────────┐ ┌────────────────────────────┐
│          Spring Boot Core Backend            │ │    FastAPI AI Engine       │
│  • Identity & RBAC (Argon2id + JWT)          │ │ • Career Copilot           │
│  • Institutional Sovereignty & Multitenancy  │ │ • Skill Gap Radar          │
│  • Placement & Internship Workflow Engine    │ │ • ATS Resume Evaluator     │
│  • Audit & DPDP Compliance Logger            │ │ • Match Explanation Engine │
└──────────────┬───────────────────────────────┘ └─────────────┬──────────────┘
               │                                               │
               ├───────────────────────────┬───────────────────┤
               ▼                           ▼                   ▼
┌──────────────────────────────┐ ┌───────────────────┐ ┌──────────────────────┐
│        PostgreSQL 16         │ │      Redis 7      │ │      MinIO / S3      │
│  • Relational Data           │ │  • Auth Cache     │ │  • Resumes & Docs    │
│  • Flyway Migrations (V1-V4) │ │  • Rate Limiting  │ │  • Skill Badges      │
│  • JSONB Attributes          │ │  • Active Tokens  │ │  • Verification Docs │
└──────────────────────────────┘ └───────────────────┘ └──────────────────────┘
```

---

## 3. Core Subsystems

### A. Identity & Multitenant Access Control (RBAC)
- 15 specialized system roles:
  - `STUDENT`, `ALUMNI`, `FACULTY`, `MENTOR`, `TPO`, `DEPARTMENT_ADMIN`, `INSTITUTION_ADMIN`
  - `EMPLOYER`, `RECRUITER`, `RESEARCH_ORGANIZATION`, `VERIFIER`, `COMPLIANCE_OFFICER`
  - `SCHEME_ADMIN`, `PLATFORM_ADMIN`, `SUPER_ADMIN`
- Cryptographic security via Argon2id (saltLength=16, hashLength=32, memory=65536KB, iterations=3).
- Short-lived signed JWTs (15 min) with HTTP-only revocation tokens.

### B. Skill Intelligence & Matching Engine
- Multi-dimensional scoring formula:
  $$\text{Score} = w_s \cdot S_{\text{alignment}} + w_a \cdot A_{\text{eligibility}} + w_e \cdot E_{\text{experience}} + w_l \cdot L_{\text{location}}$$
- Complete transparency: every match score includes explicit reasons for recommendation and unmet prerequisites.

### C. DPDP Act Compliance & Security Gateway
- Indian Digital Personal Data Protection Act (2023) safeguards:
  - Automated regex-based redaction of Aadhaar, PAN, phone numbers, and email before LLM context ingestion.
  - Explicit purpose-limited consent flags in registration (`acceptedTerms`, `acceptedPrivacyPolicy`).
  - Immutable audit trail capturing timestamp, IP, actor, and affected entity.
