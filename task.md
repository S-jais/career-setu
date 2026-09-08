# CareerSetu — Task List

## Phase 1: Foundation (COMPLETED)

### Infrastructure
- [x] Create project directory structure
- [x] Docker Compose (PostgreSQL, Redis, MinIO, RabbitMQ, Mailpit, Prometheus, Grafana)
- [x] .env.example files
- [x] nginx config (dev gateway)

### Database (Flyway Migrations)
- [x] V1__create_core_identity_tables.sql
- [x] V2__create_student_institution_tables.sql
- [x] V3__create_company_skill_opportunity_tables.sql
- [x] V4__seed_demo_data.sql

### Backend (Spring Boot)
- [x] Maven project setup (Java 25 + Spring Boot)
- [x] Application properties + security config
- [x] JWT auth implementation (Argon2id + HMAC-SHA512)
- [x] RBAC + authorization framework (15 roles)
- [x] User registration + login endpoints
- [x] Error handling + safe error format (GlobalExceptionHandler)
- [x] OpenAPI/Swagger documentation
- [x] Native Java 25 compilation verified (Clean build success)

### AI Service (FastAPI)
- [x] Python project setup with venv
- [x] AI provider abstraction (Gemini / Intelligent Local Fallback)
- [x] Career copilot endpoint (/api/v1/ai/copilot)
- [x] Resume analyzer endpoint (/api/v1/ai/resume-analyzer)
- [x] Skill gap endpoint (/api/v1/ai/skill-gap)
- [x] Opportunity match scoring endpoint (/api/v1/ai/match)
- [x] Security gateway middleware (PII masking for DPDP Act, prompt injection defense)
- [x] Automated test suite verified (All 5 endpoints passing 200 OK)

### Frontend (React + TypeScript)
- [x] Vite + React 19 + TypeScript + Tailwind CSS setup
- [x] Design system (HSL tokens, typography, gradients, glassmorphism)
- [x] Google Fonts integration (Inter & Outfit)
- [x] Landing page — Hero section
- [x] Landing page — How it works
- [x] Landing page — Student/Industry/Institution journeys
- [x] Landing page — Skill intelligence + AI Copilot sections
- [x] Landing page — Trust/verification section
- [x] Landing page — Testimonials + FAQ + Footer
- [x] Auth — Login page
- [x] Auth — Registration page (role-aware)
- [x] Student — Overview dashboard
- [x] Student — Career Passport
- [x] Student — Skill Intelligence
- [x] Student — Opportunity Marketplace
- [x] Student — Applications tracker
- [x] Employer — Overview dashboard
- [x] Employer — Job management
- [x] Employer — ATS (applicant tracking)
- [x] Institution/TPO — Overview dashboard
- [x] AI Copilot — Chat interface
- [x] Assessment — Skill assessment flow
- [x] Core components (Navbar, Sidebar, Cards, etc.)
- [x] Production build verified (`npm run build` passing cleanly)

### Documentation
- [x] README.md
- [x] ARCHITECTURE.md
- [x] DEPLOYMENT.md
- [x] SECURITY.md

## Phase 2+: Core Business & Advanced Modules (COMPLETED)
- [x] Full student profile onboarding wizard (`/student/onboarding`)
- [x] Interactive skill graph visualizer (Prerequisite tree, tiers, unlocks)
- [x] Live code assessment sandbox (Problem statement, language switch, test runner)
- [x] Backend Domain Services & Controllers:
  - [x] Skills API (`/api/v1/skills`)
  - [x] Companies API (`/api/v1/companies`)
  - [x] Opportunities API (`/api/v1/opportunities`)
  - [x] Student Profiles API (`/api/v1/students`)
  - [x] Applications Pipeline API (`/api/v1/applications`)
- [x] Live AI Copilot connectivity between frontend and FastAPI engine

## Phase 3: Live Application & End-to-End Reactive Pipelines (COMPLETED)
- [x] Typed frontend API client layer (`opportunityApi.ts`, `applicationApi.ts`)
- [x] Live Opportunity Marketplace integration with real-time search & filters
- [x] "Apply with Career Passport" modal & duplicate application prevention
- [x] Enriched backend Application DTO projections (titles, company names, locations)
- [x] Dynamic 5-stage Application Tracker (`/student/applications`)
- [x] End-to-end integration verified via Vite reverse proxy and Spring Boot REST API

## Phase 4: Recruiter ATS, Skill Minting, AI Resume Studio & Copilot (COMPLETED)
- [x] Recruiter ATS Kanban board with 6 hiring stages (`/employer/applicants`)
- [x] Dual ATS view modes (Interactive Kanban columns + Table list)
- [x] Live candidate stage transitions via `PATCH /api/v1/applications/{id}/status`
- [x] Real-time cross-tier applicant synchronization between recruiter ATS and student tracker
- [x] Spring Boot Skills Catalog integration (`/api/v1/skills` & `/api/v1/skills/high-demand`)
- [x] Interactive "+ Add/Declare Skill" modal and dynamic competency metrics in Skill Intelligence
- [x] Proctored Code Assessment sandbox with multi-language test execution (`/student/assessment`)
- [x] Verifiable skill badge minting with cryptographic hashes (`badgeStore`)
- [x] Dynamic Career Passport displaying earned badges and verified competencies (`/student/passport`)
- [x] Vite reverse proxy for microservices gateway (`/api/v1/ai` -> FastAPI, `/api` -> Spring Boot)
- [x] Interactive ATS Resume Studio with deep keyword, impact verb, and metric scoring (`/student/copilot`)
- [x] Real-time Conversational AI Copilot with context injection and recommended skills tags
- [x] Complete system automated end-to-end test verification passing cleanly

## Phase 5: Student Profile Sync, Resume File Upload & Notification Center (COMPLETED)
- [x] Spring Boot Student Profile integration (`GET /api/v1/students/me` & `PUT /api/v1/students/me`)
- [x] Typed frontend student profile API client (`studentApi.ts`)
- [x] Interactive "Edit Career Passport" modal with live persistence (Headline, Bio, CGPA, Social Links, Actively Seeking toggle)
- [x] Dynamic profile strength & completion percentage recalculation
- [x] FastAPI multi-format Resume Upload endpoint (`POST /api/v1/ai/resume/upload` using `pypdf` & multipart)
- [x] Frontend ATS Resume Studio drag-and-drop file upload zone with instant text extraction & parsing
- [x] In-app real-time notification store (`notificationStore.ts`) with priority indicators & unread counter
- [x] Interactive Notification Popover dropdown in Dashboard top navigation bar with category icons and mark-as-read
- [x] Automated Phase 5 end-to-end test suite verified with 100% pass rate

## Phase 6: Complete Multi-Role Frontend Ecosystem (COMPLETED)
- [x] Student Learning & NEP 2020 Roadmaps (`/student/learning`) with virtual threads, GenAI, and interactive quiz checks
- [x] Industry Mentorship Gateway (`/student/mentors`) with 1:1 scheduling and Google Meet invites
- [x] Tech Events & Hackathons Hub (`/student/events`) with prize pools, team registration, and fast-track hiring
- [x] Direct Recruiter & Mentor Message Center (`/student/messages` & `/employer/messages`) with real-time response simulation
- [x] Employer Interview Scheduler & Evaluations (`/employer/interviews`) with multi-round management
- [x] Recruitment Analytics & Funnel Dashboard (`/employer/analytics`) with feeder institution metrics
- [x] Company Profile & MCA / GSTIN Verification Center (`/employer/profile`) with corporate identity editor
- [x] University Student Cohort Directory (`/institution/students`) with NEP 14-credit tracker & CSV export
- [x] Placement Drives & Industry Engagements Manager (`/institution/drives`) with automated batch broadcasting
- [x] Complete 25-route navigation map verified with 100% 200 OK responses across all portals

## Phase 7: Backend APIs & Persistence for Advanced Modules (COMPLETED)
- [x] Direct Messaging Module (`in.careersetu.messaging`): `ChatMessage` entity, repository, service, DTOs, and `/api/v1/messages` controller
- [x] Interview Scheduling Module (`in.careersetu.interviews`): `InterviewSchedule` entity, repository, service, DTOs, and `/api/v1/interviews` controller
- [x] Mentorship Gateway Module (`in.careersetu.mentorship`): `MentorProfile`, `MentorshipSession` entities, repositories, service, DTOs, and `/api/v1/mentors` controller
- [x] Campus Events & Hackathons Module (`in.careersetu.events`): `CampusEvent`, `EventRegistration` entities, repositories, service, DTOs, and `/api/v1/events` controller
- [x] Security Configuration (`SecurityConfig.java`): Public access for `/api/v1/events/**` and `/api/v1/mentors/**`
- [x] Dev Data Seeder (`DevDataSeeder.java`): Automated seeding of initial mentors, hackathons, scheduled interviews, and recruiter-student conversation threads
- [x] Frontend Typed API Clients: `messageApi.ts`, `interviewApi.ts`, `mentorshipApi.ts`, `eventsApi.ts`
- [x] Frontend Component Integration: Connected `MessageCenter.tsx`, `InterviewScheduler.tsx`, `MentorshipHub.tsx`, and `CampusEvents.tsx` to live backend APIs
- [x] Automated Test Verification: `scripts/test_phase6_backend.ps1` passing 8/8 tests with 100% success rate
- [x] Production Frontend Build: `npm --prefix frontend run build` passing cleanly in 911ms with 0 errors

## Phase 8: Complete Backend Ecosystem & Enterprise Modules (COMPLETED)
- [x] Institution & TPO Cohort Module (`in.careersetu.institutions`): `InstitutionStudent` entity, repository, service, and `/api/v1/institutions/students`
- [x] High-Throughput Bulk CSV Parser: `POST /api/v1/institutions/students/bulk-upload` parsing student batch roster spreadsheets with automatic NEP 2020 14-credit calculation
- [x] Institutional Analytics: `GET /api/v1/institutions/stats` computing average CGPA, NEP compliant %, and placement rates
- [x] Campus Placement Drives Module: `PlacementDrive`, `DriveRegistration` entities, repositories, service, and `/api/v1/drives` endpoints (listing, scheduling, student registration, stage progression, broadcasting)
- [x] In-App Notification System (`in.careersetu.notifications`): `AppNotification` entity, repository, service, and `/api/v1/notifications` endpoints (`/my`, `/unread-count`, `/{id}/read`, `/read-all`)
- [x] Verifiable Assessment Submissions & Cryptographic Credentials (`in.careersetu.assessment`): `AssessmentSubmission` entity, repository, service, and `/api/v1/assessment` endpoints (SHA-256 badge minting & public verification via `GET /verify/{hash}`)
- [x] Company Corporate Profile & Indian GSTIN Verification (`in.careersetu.companies`): `CompanyService` & `CompanyController` (`/primary`, `/{id}/verify-gstin`, `PUT /{id}`)
- [x] Dev Data Seeder: Initialized TPO cohort records, placement drives, in-app notifications, and cryptographic badges
- [x] Frontend Typed API Layer: `institutionApi.ts`, `notificationApi.ts`, `assessmentApi.ts`, `companyApi.ts`
- [x] Frontend UI Integration:
  - [x] `StudentDirectory.tsx`: Connected to live student cohort and added interactive **Bulk CSV Upload Modal** with drag-and-drop
  - [x] `PlacementDrives.tsx`: Connected to live placement drives with drive creation, broadcasting, and status progression
  - [x] `AssessmentPage.tsx`: Connected code submission to live SHA-256 badge minting and display in success card
  - [x] `CompanyProfilePage.tsx`: Connected corporate profile loading, editing, and GSTIN verification
- [x] Automated Backend Test Suite: `scripts/test_phase8_complete_backend.ps1` passing 11/11 tests with 100% success rate
- [x] Production Frontend Build: `npm --prefix frontend run build` compiling cleanly in 923ms with 0 errors


