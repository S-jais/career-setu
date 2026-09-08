# Deploying CareerSetu Backend on Render

This guide provides step-by-step instructions to deploy the **CareerSetu Spring Boot Backend (Java 21)** and **PostgreSQL Database** on [Render.com](https://render.com).

---

## Architecture on Render

```
  ┌─────────────────────────────────────────────────────────────┐
  │                         Render Cloud                        │
  │                                                             │
  │  ┌───────────────────────┐       ┌───────────────────────┐  │
  │  │  careersetu-backend   │──────▶│     careersetu-db     │  │
  │  │   (Spring Boot 3.4)   │       │   (PostgreSQL 16)     │  │
  │  │   Port: $PORT (10000) │       │                       │  │
  │  └───────────┬───────────┘       └───────────────────────┘  │
  │              │                                              │
  │              ▼                                              │
  │  ┌───────────────────────┐                                  │
  │  │     careersetu-ai     │                                  │
  │  │    (FastAPI Python)   │                                  │
  │  └───────────────────────┘                                  │
  └─────────────────────────────────────────────────────────────┘
                 ▲
                 │ REST API (HTTPS)
  ┌──────────────┴──────────────┐
  │     Frontend (Vite/React)   │
  │  (Vercel / Netlify / Render)│
  └─────────────────────────────┘
```

---

## Method 1: 1-Click Deploy via Render Blueprint (Recommended)

Render Blueprints let you spin up the database and services automatically using the included `render.yaml`.

### Steps:
1. **Push your code to GitHub**:
   Ensure all changes (`backend/Dockerfile`, `render.yaml`, `application-render.yml`) are committed and pushed to your GitHub repository.

2. **Open Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com/).
   - Click **New +** in the top-right corner and select **Blueprint**.

3. **Connect Repository**:
   - Select your `career-Setu` repository.
   - Render will parse `render.yaml` and display:
     - `careersetu-backend` (Docker Web Service)
     - `careersetu-db` (PostgreSQL Database)
     - `careersetu-ai` (FastAPI Web Service)

4. **Click "Apply"**:
   - Render will create the database, generate a secure `JWT_SECRET`, link `DATABASE_URL` automatically, build the Docker image, and launch the services!

---

## Method 2: Manual Setup via Render Dashboard

If you prefer to configure each service manually:

### Step 1: Create PostgreSQL Database on Render
1. Click **New +** &rarr; **PostgreSQL**.
2. Set the following:
   - **Name**: `careersetu-db`
   - **Database**: `careersetu`
   - **User**: `careersetu_user`
   - **Region**: Oregon (or your preferred region)
   - **PostgreSQL Version**: 16
   - **Plan**: Free
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgresql://careersetu_user:pass@dpg-xxx:5432/careersetu`).

---

### Step 2: Create Web Service for Spring Boot Backend
1. Click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name**: `careersetu-backend`
   - **Region**: Same region as your database (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank (or `backend`)
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
   - **Plan**: Free

4. **Environment Variables**:
   Under **Environment Variables**, add:

   | Key | Value | Description |
   |---|---|---|
   | `SPRING_PROFILES_ACTIVE` | `render` | Activates Render cloud profile |
   | `DATABASE_URL` | *(Paste Internal DB URL from Step 1)* | Render normalizes this automatically |
   | `JWT_SECRET` | *(Random 64+ char secret)* | Secret for signing JWTs |
   | `CORS_ALLOWED_ORIGINS` | `https://*.onrender.com,http://localhost:5173` | Allowed frontend domains |
   | `FEATURE_AI_ENABLED` | `true` | Enables AI feature flags |

5. Under **Health Check Path**, enter:
   ```
   /actuator/health
   ```

6. Click **Create Web Service**.

---

## Verifying Your Deployment

Once Render finishes building and starts your container, verify:

### 1. Actuator Health Check
Open in your browser:
```
https://<your-backend-app-name>.onrender.com/actuator/health
```
**Expected response**:
```json
{"status":"UP","components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"},"ping":{"status":"UP"}}}
```

### 2. Interactive Swagger UI
Explore all 50+ REST endpoints:
```
https://<your-backend-app-name>.onrender.com/swagger-ui.html
```

### 3. Test Authentication
Test logging in using one of the pre-seeded demo accounts:
- **POST** `/api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "student@careersetu.in",
    "password": "Demo@CareerSetu2024"
  }
  ```
- **Response**: Returns JWT access token and user profile.

---

## Connecting Your Frontend

In your React / Vite frontend (`frontend/.env.production` or Render environment settings):

```env
VITE_API_BASE_URL=https://<your-backend-app-name>.onrender.com/api/v1
```

Rebuild/redeploy the frontend, and all dashboard tabs (Applications, Skill Intelligence, Digital Twin, Assessments) will communicate with your live Render backend!

---

## Important Free Tier Notes

> [!NOTE]
> - **Spin-Down on Inactivity**: On Render's Free Tier, services spin down after 15 minutes of inactivity. When a new request arrives, it may take 30-50 seconds to wake up (cold start).
> - **Automatic Database Seeding**: The backend automatically seeds demo tenants, skills, institutions, and users on first run if the tables are empty.
