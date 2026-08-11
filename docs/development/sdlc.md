# 5. Software Development Life Cycle (SDLC)

The project followed a structured phased implementation approach:

### Phase 1: Planning
- Defined the target audience (B2B wholesale) and operational workflows.
- Evaluated technology stacks (React SPA vs Next.js SSR, Express vs NestJS).
- Decided on React (Vite) + Express + Supabase PostgreSQL for maximum velocity and free-tier compatibility.

### Phase 2: Requirement Analysis
- Conducted deep research into required DB schemas and normalization.
- Defined the strict RBAC matrix for Admin, Sales, Warehouse, and Accounts.
- Outlined concurrency requirements for inventory deductions.

### Phase 3: System Design
- Drafted the 3NF database schema (Users, Customers, Products, Challans, etc.).
- Outlined API routes and standard JSON response payloads.
- Designed the transactional strategy using `SELECT FOR NO KEY UPDATE`.

### Phase 4: Implementation
- Separated the workspace into `client/` and `server/` mono-repo structure.
- Developed backend routes, Zod validation, and pg-based repositories.
- Developed frontend components, API service connectors, and TanStack Query hooks.
- Implemented the UI utilizing Tailwind CSS.

### Phase 5: Testing
- Executed unit tests on API logic and Zod validators.
- Executed integration testing on the backend RBAC mechanisms.
- Conducted critical concurrency simulations to verify the database lock mechanic successfully blocks negative stock.

### Phase 6: Deployment
- Containerized the backend using Docker (`docker-compose.yml`) for local testing.
- Prepared Vite environment variables for Vercel deployment.
- Configured Express to serve via Render/Railway on `env.PORT`.

### Phase 7: Maintenance / Future Improvements
- Identified areas for future expansion (e.g., multi-warehouse tables, billing flows, frontend E2E tests).
