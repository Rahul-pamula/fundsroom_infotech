# Mini ERP + CRM Operations Portal

Welcome to the documentation for the **Mini ERP + CRM Operations Portal**. This system is designed specifically for small-to-medium wholesale and distribution businesses, bridging essential operational functions across sales teams, warehouse personnel, accounts departments, and executive administration.

## Quick Links
- [1. Overview](01-overview.md)
- [2. Problem Statement](02-problem-statement.md)
- [3. Objectives](03-objectives.md)
- [4. Requirements](04-requirements.md)
- [5. SDLC](05-sdlc.md)
- [6. System Design](06-system-design.md)
- [7. Architecture](07-architecture.md)
- [8. Project Structure](08-project-structure.md)
- [9. Authentication & RBAC](09-authentication-rbac.md)
- [10. Database](10-database.md)
- [11. Backend API](11-backend-api.md)
- [12. Frontend](12-frontend.md)
- [13. Features](13-features.md)
- [14. Testing](14-testing.md)
- [15. Deployment](15-deployment.md)
- [16. User Guide](16-user-guide.md)
- [17. Screenshots](17-screenshots.md)
- [18. Limitations & Future Scope](18-limitations-future-scope.md)

## Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TanStack Query
- **Backend API**: Node.js, Express, TypeScript, Zod
- **Database**: Supabase (Managed PostgreSQL)
- **Database Driver**: `pg` (Node.js PostgreSQL client)

## Core Modules
- **CRM Module**: Lead and active customer lifecycle, follow-up timeline tracking.
- **Inventory Module**: Product catalog management, chronological stock movement ledger.
- **Sales Module**: Draft and confirmed sales challans with atomic stock deduction.
- **RBAC Engine**: Roles for ADMIN, SALES, WAREHOUSE, and ACCOUNTS.

## Deployment Overview
- **Frontend (Static SPA)** → Vercel
- **Backend API (Node/Express)** → Railway / Render
- **Database (PostgreSQL)** → Supabase
- **Documentation (Markdown)** → GitHub Pages

## Quick Start (Local Development)
Ensure you have Docker installed and run:
```bash
docker-compose up -d --build
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api/v1`
