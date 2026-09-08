# 🎓 CareerSetu (कैरियर सेतु)
> **“Skills to Opportunities. Campus to Career.”**  
> *India-First AI Career & Academia–Industry Collaboration Operating System*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/Frontend-React_19_|_TypeScript-61DAFB.svg)](frontend/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_|_Java_25-6DB33F.svg)](backend/)
[![FastAPI](https://img.shields.io/badge/AI_Engine-FastAPI_|_Python_3.13-009688.svg)](ai-service/)
[![DPDP Compliant](https://img.shields.io/badge/Compliance-DPDP_Act_2023-success.svg)](#security--dpdp-compliance)

---

## 🌟 Executive Summary

**CareerSetu** is a unified national-scale career intelligence and academia–industry bridge platform designed specifically for the Indian higher education and corporate hiring ecosystem. 

Unlike conventional job portals, college ERPs, or LinkedIn clones, CareerSetu unifies **Students**, **Institutions (TPOs & Faculty)**, **Employers (Startups to GCCs)**, **Alumni Mentors**, and **Government Scheme Administrators** into an integrated talent discovery and skill-building lifecycle:

```
ASSESS  ──►  PROFILE  ──►  UPSKILL  ──►  MATCH  ──►  APPLY  ──►  INTERN  ──►  HIRE
```

---

## 🏛️ Ecosystem Stakeholders & Portals

| Stakeholder | Key Capabilities |
| :--- | :--- |
| **Students & Alumni** | Dynamic Career Passport, AI Skill Gap Radar, Verified Credentials, Multi-stage Application Tracker, 1-on-1 Mentorship Booking, AI Copilot. |
| **Training & Placement Officers (TPOs)** | Cohort Placement Drives, Eligibility Rule Enforcement, Department Skill Analytics, Unplaced Student Interventions, Company Visit Coordination. |
| **Employers & Recruiters** | Company Verification (CIN/GST), Opportunity Marketplace Listings, Explainable AI Match Scores, Stage-based Applicant Tracking System (ATS). |
| **Faculty & Mentors** | Curriculum Skill Mapping, Student Recommendation Endorsements, Industry Project Co-supervision, Mock Interview Feedback. |
| **Government & Regulators** | Aggregated Employment Trend Analytics, AICTE/UGC Internship Mandate Tracking, Affirmative Opportunity Schemes (PMKVY/NATS). |

---

## 🚀 Key Modules & AI Intelligence Suite

### 1. 🤖 Career Copilot
- Intelligent conversational assistant powered by Google Gemini and localized career domain models.
- Provides personalized study roadmaps, DSA prep strategies, system design tips, and behavioral interview coaching tailored to Tier-1, Tier-2, and Tier-3 Indian engineering & management institutions.
- Built-in **DPDP Act compliance guardrails** with automated PII masking and prompt-injection defense.

### 2. ⚡ Skill Intelligence & Gap Radar
- Analyzes candidate capabilities against real-time industry benchmark job requirements.
- Distinguishes between **Critical** vs **Supplementary** skill deficiencies.
- Generates individualized learning tracks with curated tutorials and estimated completion hours.

### 3. 📄 ATS Resume Analyzer & Enhancer
- Evaluates resumes against target role keywords, quantifiable STAR impact metrics, and parsing constraints.
- Delivers an actionable ATS compatibility score (0–100) and pinpointed bullet point improvements.

### 4. 🎯 Explainable Opportunity Matching Engine
- Multi-dimensional candidate-to-opportunity scoring based on verified skills, academic cutoffs (CGPA), backlog rules, and work mode preferences.
- Transparent match breakdown explaining exactly *why* a candidate was recommended or what criteria remain unmet.

### 5. 🛡️ Trust, Verification & Institutional Sovereignty
- Role-based access control (RBAC) with 15 granular roles.
- CIN/GST verification for hiring companies to eliminate fraudulent postings.
- Cryptographic verification for skill badges and academic transcripts.

---

## 🛠️ Architecture & Tech Stack

```
                        ┌─────────────────────────────────────────┐
                        │             Nginx Gateway               │
                        │       (SSL / Reverse Proxy / Gzip)      │
                        └───────────────────┬─────────────────────┘
                                            │
                ┌───────────────────────────┼───────────────────────────┐
                ▼                           ▼                           ▼
  ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
  │   Frontend Application   │ │     Backend Services     │ │      AI Intelligence     │
  │  React 19 + TypeScript   │ │  Spring Boot + Java 25   │ │     FastAPI + Python     │
  │ TailwindCSS + Framer M.  │ │  Argon2id + JWT + REST   │ │ Gemini / Local Fallback  │
  └──────────────────────────┘ └────────────┬─────────────┘ └──────────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌──────────────┐    ┌──────────────┐                ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │ Redis Cache  │                │ RabbitMQ Msg │    │ MinIO Object │
│ (Relational) │    │(Session/Rate)│                │ (Async Jobs) │    │  (S3 Doc/CV) │
└──────────────┘    └──────────────┘                └──────────────┘    └──────────────┘
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Zustand, React Hook Form, Zod.
- **Backend**: Java 25, Spring Boot, Spring Security (Stateless JWT + Argon2id), Spring Data JPA, Flyway Migrations, OpenAPI 3 / Swagger.
- **AI Service**: Python 3.13, FastAPI, Uvicorn, Pydantic v2, Google Gemini API, Local Fallback Rule Engine.
- **Data & Storage**: PostgreSQL 16, Redis 7, MinIO (S3-compatible document storage), RabbitMQ.
- **DevOps**: Docker & Docker Compose, Prometheus, Grafana, OpenTelemetry.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v20+ and npm
- **Java**: OpenJDK 21 or 25
- **Maven**: 3.9+ (located in `C:\tools\maven\apache-maven-3.9.9\bin` or on PATH)
- **Python**: 3.11+

---

### 1. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
The client will be running at `http://localhost:5173`.

---

### 2. Start the AI Intelligence Service

```bash
cd ai-service
# Activate existing virtual environment:
.\venv\Scripts\activate
# Start FastAPI development server:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The AI Service interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

### 3. Build & Run the Spring Boot Backend

```bash
cd backend
# Compile & verify:
mvn clean compile -DskipTests
# Run Spring Boot:
mvn spring-boot:run
```
The API server runs at `http://localhost:8080`. Swagger documentation is at `http://localhost:8080/swagger-ui.html`.

---

### 4. Start Infrastructure via Docker Compose (Optional)

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

This launches PostgreSQL (5432), Redis (6379), MinIO (9000/9001), RabbitMQ (5672/15672), Mailpit (8025), and observability tools.

---

## 🔒 Security & DPDP Compliance

CareerSetu is built in compliance with India's **Digital Personal Data Protection Act (DPDP Act 2023)** and OWASP Top 10 standards:
- **Argon2id** password hashing with cryptographically unique salts.
- **PII Scrubbing**: Automatic masking of Aadhaar, PAN, phone numbers, and email IDs prior to AI inference.
- **Stateless Tokens**: Short-lived (15-min) signed JWTs paired with revocable refresh tokens.
- **Audit Logging**: Immutable security event logs for authentication, role modifications, and document access.
- **Granular RBAC**: Multi-tenant institutional data partitioning ensuring campus data sovereignty.

---

## 📄 License
Licensed under the Apache License, Version 2.0.
