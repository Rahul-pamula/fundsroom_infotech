# Mini ERP + CRM Operations Portal

> Production-style ERP + CRM operations platform for wholesale/distribution workflows.

A full-stack business operations system for managing customers, products, inventory, stock movements, sales challans, follow-ups, authentication, and role-based access control.

## 🚀 Live Demo

- Frontend: https://fundsroom-infotech-client.vercel.app/
- Backend API: https://fundsroom-api-u6tm.onrender.com
- Documentation: https://rahul-pamula.github.io/fundsroom_infotech/

## ✨ Features

| Module | Highlights |
|---|---|
| Authentication | JWT authentication + RBAC |
| Customer CRM | Add, edit, search, details, follow-ups |
| Products | SKU, category, pricing, stock |
| Inventory | IN/OUT movements and low-stock visibility |
| Challans | Draft, confirm, cancel, multiple products |
| Dashboard | Operational summaries and recent activity |

## 🛠️ Stack

- React + TypeScript + Vite
- Node.js + Express
- PostgreSQL / Supabase
- JWT authentication
- Zod validation
- Docker
- Vitest

## 🔐 Roles

| Role | Purpose |
|---|---|
| ADMIN | Full operational control |
| SALES | Customer and sales workflows |
| WAREHOUSE | Inventory and stock operations |
| ACCOUNTS | Customer, product and challan operations |

Role authorization is enforced server-side; the login role selection is verified against the user's actual database role.

## 📦 Local Setup

See the dedicated [Setup Guide](SETUP.md).

The seed script requires a locally supplied `SEED_PASSWORD`; no default development password is stored in this repository.

```bash
cd server
npm install
npm run migrate
npm run seed
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

## 🧪 Verification

Backend:

```bash
cd server
npm run typecheck
npm run lint
npm test
npm run build
```

Frontend:

```bash
cd client
npm run typecheck
npm run lint
npm test
npm run build
```

## 📚 Documentation

The complete documentation covers requirements, SDLC, system design, architecture, authentication/RBAC, database design, API reference, frontend architecture, features, testing, deployment, user guide, screenshots, limitations, and future scope.

Documentation: https://rahul-pamula.github.io/fundsroom_infotech/

## 🏗️ Architecture

```text
User
 │
 ▼
React Frontend
(Vercel)
 │
 │ HTTPS / REST API
 ▼
Express Backend
(Render)
 │
 │ pg
 ▼
Supabase PostgreSQL
```

## 🔒 Security Notes

- Secrets belong in environment variables, never in source control.
- `JWT_SECRET` must be a strong random production secret.
- `SEED_PASSWORD` is required only when running the seed script.
- Seed credentials must never be published in README files, documentation, screenshots, or issues.
- Authentication and role authorization are enforced on the backend.

## 📄 Project Documentation

- `SETUP.md` — local installation and environment configuration
- `docs/` — system, feature, development, security, testing, and deployment documentation
