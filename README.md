# Zorvyn Assignment Backend

A TypeScript + Express + Prisma backend for financial record management, dashboard analytics, and CSV exports.

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- json2csv (CSV export)
- OpenAI SDK (used with Gemini OpenAI-compatible endpoint)
- express-rate-limit (API protection)
- Swagger (OpenAPI documentation)

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm
- PostgreSQL (local) OR Docker

## Setup Instructions

### 1) Clone and move into project

```bash
git clone https://github.com/ankitjha209/financial-data-processing-backend
```

### 2) Install TypeScript globally (as requested)

```bash
npm i -g typescript
```

### 3) Install project dependencies

```bash
npm install
```

### 4) Start PostgreSQL

Option A: Docker (recommended)

```bash
docker compose up -d
```

This project includes a Docker Postgres service configured in docker-compose.yml:

- host: localhost
- port: 5432
- user: postgres
- password: postgres
- database: financial

Option B: Use your local PostgreSQL instance.

### 5) Create environment file

Create a .env file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financial"
JWT_SECRET_KEY="your_super_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
PORT=8080
```

### 6) Run Prisma migrations

```bash
npx prisma migrate dev
```

### 7) Generate Prisma client (safe to run any time)

```bash
npx prisma generate
```

Run this to get dummy data in the current table

```bash
npm run seed
```

### 8) Start backend

```bash
npm run dev
```

Server starts on:

- http://localhost:8080

## Build/Run Notes

Current script behavior:

- npm run dev runs the server in watch mode using tsx: `tsx watch src/index.ts`.

## API Base URL

- http://localhost:8080/api

## Added Backend Essentials

### 1) Rate Limiting

- Global API rate limiting is enabled with `express-rate-limit`.
- Applied in `src/index.ts` for all routes.
- Default policy:
    - window: 15 minutes
    - max requests: 100 per IP

Why this matters:

- Protects APIs from brute-force attempts and traffic spikes.
- Improves backend stability for real users.


### 2) API Documentation

- Swagger UI enabled at:
    - `GET /api/docs`
- Raw OpenAPI JSON enabled at:
    - `GET /api/docs.json`

Why this matters:

- Makes your backend self-explanatory for interviewers, teammates, and frontend developers.
- Speeds up API testing and onboarding.


## Authentication

Most endpoints require Bearer token auth:

```http
Authorization: Bearer <token>
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Records

- GET /api/records
- POST /api/records
- GET /api/records/:id
- PUT /api/records/:id
- DELETE /api/records/:id

Access rules in code:

- GET endpoints require authenticated user (`verifyToken`).
- POST/PUT/DELETE endpoints require ADMIN role (`verifyADMIN`).

### Dashboard

- GET /api/dashboard/summary
- GET /api/dashboard/by-category
- GET /api/dashboard/trends?period=month|week
- GET /api/dashboard/recent?limit=10

### Export (CSV)

- GET /api/export/records
    - Query filters:
        - type=INCOME|EXPENSE
        - category=<CATEGORY_ENUM>
        - fromDate=YYYY-MM-DD
        - toDate=YYYY-MM-DD
        - limit=<number>

- GET /api/export/summary
    - Optional query filters:
        - fromDate=YYYY-MM-DD
        - toDate=YYYY-MM-DD

- GET /api/export/category
    - Optional query filters:
        - fromDate=YYYY-MM-DD
        - toDate=YYYY-MM-DD

Access rules in code:

- Export endpoints require authenticated ANALYST or ADMIN (`verifyANALYSTorADMIN`).

### Chat Assistant

- POST /api/chat/records
    - Body:
        - question: string
    - Auth: Bearer token required
    - Behavior:
        - The endpoint calls Gemini (via OpenAI-compatible API) to generate a SQL statement.
        - The server blocks responses that start with `BLOCKED:`.
        - If accepted, SQL is executed and result is sent back to Gemini for natural-language answer generation.

### Admin

- GET /api/admin/users
- GET /api/admin/users/:id
- PUT /api/admin/users/:id/role
- DELETE /api/admin/users/:id

## Data Model (High Level)

- User
    - id, name, email, hashPassword, role, status, timestamps

- Record
    - id, userId, amount, type (INCOME/EXPENSE), category, description, date, isDeleted, timestamps

## Assumptions Made

- PostgreSQL is the primary database.
- Authentication uses JWT and the token payload includes userId and role.
- Soft delete is used for records via isDeleted=true.
- Export endpoints are intended for ANALYST or ADMIN roles.
- Dates in query params are provided in ISO-friendly format (prefer YYYY-MM-DD).
- Chat assistant uses `GEMINI_API_KEY` and Gemini OpenAI-compatible base URL configured in code.

## Tradeoffs Considered

- Simplicity over advanced aggregation:
    - Some analytics are computed in application code after fetching records. This keeps implementation easy to read, but may be less efficient on very large datasets.

- Single dev script:
    - Current npm run dev uses `tsx watch` for local development. It is convenient for dev, but there is no dedicated production start script documented.

- Role-protected exports:
    - Restricting export endpoints improves data governance but limits access for viewer-only users.

## Common Troubleshooting

- Database connection error:
    - Confirm PostgreSQL is running and DATABASE_URL is correct.

- Prisma client mismatch:
    - Run npx prisma generate after schema/migration changes.

- Migration issues:
    - Verify database exists and credentials are correct, then rerun prisma migration command.

- 401 Unauthorized:
    - Ensure Authorization header includes valid Bearer token.

## Database Seeding

Seed file added at:

- src/scripts/seed.ts

What it does:

- Creates sample users with fixed emails and roles.
- Creates sample financial records for the admin user.
- Uses create-only user insertion (does not update existing users).

Sample credentials after seeding:

- admin@zorvyn.com / Admin@123
- analyst@zorvyn.com / Analyst@123

How to run seed:

1. Ensure PostgreSQL is running and migrations are applied.
2. Run: npm run seed

Why use seed data:

- Quickly test login, dashboard, and export APIs.
- Keep demo and QA environments consistent.

Important note:

- Since seed uses create-only for users, running npm run seed multiple times without resetting or cleaning data may fail with duplicate email errors.

## Folder Structure

```text
Zorvyn-Assignment/
|-- docker-compose.yml
|-- package.json
|-- tsconfig.json
|-- prisma.config.ts
|-- src/
|   |-- index.ts
|   |-- controllers/
|   |   |-- admin.controller.ts
|   |   |-- auth.controller.ts
|   |   |-- chat.controller.ts
|   |   |-- dashboard.controller.ts
|   |   |-- export.controller.ts
|   |   `-- record.controller.ts
|   |-- middlewares/
|   |   |-- auth.middleware.ts
|   |   `-- validate.ts
|   |-- prismaClient/
|   |   `-- client.ts
|   |-- routes/
|   |   |-- admin.routes.ts
|   |   |-- auth.routes.ts
|   |   |-- chat.routes.ts
|   |   |-- dashboard.routes.ts
|   |   |-- export.routes.ts
|   |   `-- record.routes.ts
|   |-- schemas/
|   |   |-- admin.schema.ts
|   |   |-- auth.schema.ts
|   |   |-- chat.schema.ts
|   |   `-- record.schema.ts
|   |-- scripts/
|   |   `-- seed.ts
|   `-- utils/
|       `-- passwordEncryption.ts
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- generated/
|   `-- prisma/
`-- README.md
```
