# CFA Scholarship Portal

Scholarship application portal for the Children's Foundation of America, supporting present and former foster youth.

## Tech Stack

- **Frontend:** Next.js 15 (React 19, TypeScript, Tailwind CSS) — `frontend/`
- **Backend:** Express.js 5 (TypeScript, Mongoose 9) — `backend/`
- **Database:** MongoDB 7 (via Docker Compose)
- **File Storage:** AWS S3
- **Auth:** Passport.js local strategy with express-session (sessions stored in MongoDB via connect-mongo)

## Running Locally

```bash
docker compose up
```

This starts three services:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **MongoDB:** localhost:27017 (credentials: `cfa-scholarship-portal` / `local_dev`)

## Project Structure

```
backend/src/
  models/          # Mongoose schemas (User, Application, File, AcceptanceForm, ReimbursementRequest, RenewalChecklist)
  routes/          # Express route handlers
  middleware/      # auth.ts — ensureAuthenticated, requireAdmin, requireOwnershipOrAdmin
  utils/           # s3Client.ts, passportConfig.ts, bcryptUtils.ts
  validators/      # Express-validator rules
  server.ts        # App entrypoint

frontend/src/
  app/             # Next.js pages (/, /new-applicant, /renewal, /acceptance)
  components/      # FileUpload.tsx
```

## Key Environment Variables (backend)

- `DB_URL` — MongoDB connection string (default: `mongodb://db:27017/cfa`)
- `BACKEND_PORT` — server port (default: `8080`)
- `FRONTEND_ADDRESS` — CORS origin (default: `http://localhost:3000`)
- `SESSION_SECRET` — express-session secret
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME` — S3 file uploads

## API Routes

- `POST /users/register`, `POST /users/login`, `POST /users/logout`, `GET/PUT /users/profile`
- `POST /api/applications/new` — submit new application (no auth required)
- `POST /api/applications/renewal` — submit renewal application (no auth required)
- `GET /api/applications` — list applications (admin only)
- `GET /api/applications/:id` — get application (owner or admin)
- `PATCH /api/applications/:id/status` — update status (admin only)
- `POST /api/files/upload`, `GET /api/files/:fileId`, `DELETE /api/files/:fileId` — file management (auth required)
- `/api/renewal-checklists`, `/api/reimbursements` — auth required

## Current Auth Status

Auth (`ensureAuthenticated`) is **removed** from the `/api/applications` route to allow unauthenticated form submissions during development. All other API routes still require authentication. The frontend forms use a placeholder userId (`000000000000000000000000`).

## Build & Dev Commands

```bash
# From project root (yarn workspaces)
yarn install          # install all deps
yarn workspace frontend dev   # start frontend only
yarn workspace backend dev    # start backend only
```

## Notes

- `backend/test-data.json` is a standalone reference file for manual API testing — not imported by any code.
- File uploads max size: 10MB.
- User roles: `student` (default), `admin`.
