# CareerSetu — Deployment & Production Guide

## 1. Local Development Setup

### Running with Docker Compose (Recommended)
Launch the backing database, cache, message broker, and storage services:

```bash
cd infrastructure
docker compose up -d
```

Services initiated:
- **PostgreSQL 16**: `localhost:5432` (User: `careersetu`, DB: `careersetu_db`)
- **Redis 7**: `localhost:6379`
- **MinIO**: `localhost:9000` (Console: `localhost:9001`)
- **RabbitMQ**: `localhost:5672` (Management: `localhost:15672`)
- **Mailpit**: `localhost:8025` (SMTP: `1025`)
- **Prometheus**: `localhost:9090`
- **Grafana**: `localhost:3001`

---

## 2. Service-by-Service Launch

### AI Service (FastAPI)
```bash
cd ai-service
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Spring Boot Backend
```bash
cd backend
mvn clean compile -DskipTests
mvn spring-boot:run
```

### React 19 Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 3. Production Deployment Matrix

| Service | Container Image | Port | Health Check |
| :--- | :--- | :--- | :--- |
| **Frontend** | `careersetu/frontend:latest` (Nginx Alpine) | 80 / 443 | `GET /` |
| **Backend** | `careersetu/backend:latest` (Eclipse Temurin JDK 21/25) | 8080 | `GET /actuator/health` |
| **AI Engine** | `careersetu/ai-service:latest` (Python 3.13 Slim) | 8000 | `GET /health` |
| **PostgreSQL** | `postgres:16-alpine` | 5432 | `pg_isready -U careersetu` |
| **Redis** | `redis:7-alpine` | 6379 | `redis-cli ping` |

---

## 4. Environment Variables Checklist

Ensure these values are configured in your production secrets manager:

- `DATABASE_URL`: `jdbc:postgresql://db:5432/careersetu_db`
- `DATABASE_USERNAME`: `careersetu`
- `DATABASE_PASSWORD`: Strong generated secret
- `JWT_SECRET`: Minimum 256-bit secret string (32+ chars)
- `GEMINI_API_KEY`: Google Gemini API key (optional, intelligent local fallback provided)
- `MINIO_ACCESS_KEY`: MinIO S3 access key
- `MINIO_SECRET_KEY`: MinIO S3 secret key
- `ENABLE_PII_MASKING`: `true` (DPDP compliance requirement)
