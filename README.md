# Mini ERP + CRM Operations Portal

Mini ERP + CRM Operations Portal is a production-style assessment project for Fundsroom Infotech. It combines a React client with an Express + PostgreSQL backend to manage customer operations, inventory, stock movements, and transaction-safe sales challans.

## Architecture

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Axios
- Backend: Node.js, TypeScript, Express, Zod, JWT, bcrypt, pg
- Database: PostgreSQL via Supabase `DATABASE_URL`
- Pattern: `Route -> Middleware -> Controller -> Service -> Repository -> PostgreSQL`

## Key Features

- JWT authentication with role-based access control
- Customer CRM with follow-up tracking
- Product and inventory management
- Auditable stock movement ledger
- Draft, confirm, and cancel sales challans
- Transaction-safe stock deduction with PostgreSQL row locking
- Dashboard summaries and low-stock visibility
- Centralized API response and error formatting

## Repository Structure

```text
client/   React SPA
server/   Express API
docs/     Research and implementation audit
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16+ or Supabase PostgreSQL

## Environment Variables

### Root `.env`

Existing Supabase values are preserved:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Backend `server/.env`

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://...
JWT_SECRET=replace-with-secure-secret
JWT_EXPIRES_IN=12h
CLIENT_URL=http://localhost:5173
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Frontend `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Example files are included:

- `.env.example`
- [client/.env.example](/Users/rahul/Desktop/fundsroom_infotech/client/.env.example)
- [server/.env.example](/Users/rahul/Desktop/fundsroom_infotech/server/.env.example)

## Local Setup

1. Install dependencies:
   `npm install`
2. Create `server/.env` and `client/.env`
3. Point `DATABASE_URL` to your Supabase PostgreSQL connection string or local PostgreSQL instance
4. Run migrations:
   `npm run migrate --workspace server`
5. Seed data:
   `npm run seed --workspace server`
6. Start both apps:
   `npm run dev`

## Database Setup

- Migrations live in [server/db/migrations/001_initial_schema.sql](/Users/rahul/Desktop/fundsroom_infotech/server/db/migrations/001_initial_schema.sql)
- Seed guidance lives in [server/db/seeds/README.md](/Users/rahul/Desktop/fundsroom_infotech/server/db/seeds/README.md)
- Backend database access is implemented through `pg`; the frontend never talks directly to Supabase for CRUD

## Migration Instructions

```bash
npm run migrate --workspace server
```

## Seed Instructions

```bash
npm run seed --workspace server
```

## Test Credentials

Created by the seed script:

- `admin@fundsroom.local` / `Password123!`
- `sales@fundsroom.local` / `Password123!`
- `warehouse@fundsroom.local` / `Password123!`
- `accounts@fundsroom.local` / `Password123!`

## Running Frontend

```bash
npm run dev:client
```

## Running Backend

```bash
npm run dev:server
```

## Testing

```bash
npm run test
```

Notes:

- Unit tests run without a live database.
- Integration and concurrency tests are present under `server/tests/integration`.
- To execute database-backed integration tests, supply a working test database and set:
  `RUN_DB_TESTS=true`

## Build and Quality Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## API Summary

### Auth

- `POST /api/v1/auth/login`

### Customers

- `GET /api/v1/customers`
- `POST /api/v1/customers`
- `GET /api/v1/customers/:id`
- `PUT /api/v1/customers/:id`
- `POST /api/v1/customers/:id/followups`

### Products and Inventory

- `GET /api/v1/products`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `POST /api/v1/products/:id/adjust-stock`
- `GET /api/v1/stock-movements`

### Challans

- `GET /api/v1/challans`
- `POST /api/v1/challans`
- `GET /api/v1/challans/:id`
- `PUT /api/v1/challans/:id`
- `POST /api/v1/challans/:id/confirm`
- `POST /api/v1/challans/:id/cancel`

### Dashboard

- `GET /api/v1/dashboard/summary`

## Docker

Local Docker support is included for reproducible development:

- [server/Dockerfile](/Users/rahul/Desktop/fundsroom_infotech/server/Dockerfile)
- [docker-compose.yml](/Users/rahul/Desktop/fundsroom_infotech/docker-compose.yml)

Start the stack with:

```bash
docker compose up -d --build
```

## CI/CD

A lightweight GitHub Actions workflow is included at:

- [.github/workflows/ci.yml](/Users/rahul/Desktop/fundsroom_infotech/.github/workflows/ci.yml)

It runs:

- dependency install
- typecheck
- lint
- test
- build

## Deployment Notes

- Frontend is intended for Vercel or Netlify
- Backend is intended for Render or Railway
- Database provider is Supabase PostgreSQL
- Use the Supabase PgBouncer connection string for production `DATABASE_URL`

## Known Limitations

- The frontend currently focuses on core operational flows and not advanced UI polish such as bulk editing or printable challan exports.
- Integration tests are implemented but require a real PostgreSQL test database to be enabled.
- Local Docker uses PostgreSQL for reproducible development; deployed environments should still use Supabase as the managed provider.
