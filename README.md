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
PORT=3000
```

### 6) Run Prisma migrations

```bash
npx prisma migrate deploy
```

If you are actively developing schema changes, you can use:

```bash
npx prisma migrate dev
```

### 7) Generate Prisma client (safe to run any time)

```bash
npx prisma generate
```

### 8) Start backend

```bash
npm run dev
```

Server starts on:

- http://localhost:3000

## Build/Run Notes

Current script behavior:

- npm run dev compiles TypeScript and runs dist/index.js.

If you need watch mode later, add scripts such as ts-node-dev or nodemon.

## API Base URL

- http://localhost:3000/api

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

### Chat Assistant

- POST /api/chat/records
    - Body:
        - question: string
    - Auth: Bearer token required
    - Behavior:
        - The AI only generates a read-only plan.
        - The server executes Prisma read queries only.
        - No update, delete, insert, or raw SQL execution is allowed.

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
- The chat assistant uses `OPENAI_API_KEY` and optional `OPENAI_MODEL` / `OPENAI_BASE_URL` if you want model-generated answers. Without an API key, the endpoint still returns the queried data plus a local fallback summary.

## Tradeoffs Considered

- Simplicity over advanced aggregation:
    - Some analytics are computed in application code after fetching records. This keeps implementation easy to read, but may be less efficient on very large datasets.

- Single dev script:
    - Current npm run dev does compile + run once (no auto-reload). This is stable and simple, but less convenient than watch mode.

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

- Creates or updates sample users with fixed emails and roles.
- Creates sample financial records for the analyst user.
- Resets only analyst records before inserting fresh sample data, so demo output stays predictable.

Sample credentials after seeding:

- admin@zorvyn.com / Admin@123
- analyst@zorvyn.com / Analyst@123

How to run seed:

1. Ensure PostgreSQL is running and migrations are applied.
2. Run: npm run seed

Why use seed data:

- Quickly test login, dashboard, and export APIs.
- Keep demo and QA environments consistent.

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
|   |   |-- dashboard.routes.ts
|   |   |-- export.routes.ts
|   |   `-- record.controller.ts
|   |-- schemas/
|   |   |-- admin.schema.ts
|   |   |-- auth.schema.ts
|   |   `-- record.schema.ts
|   `-- utils/
|       `-- passwordEncryption.ts
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- generated/
|   `-- prisma/
`-- README.md
```
