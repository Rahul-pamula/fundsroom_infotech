# 6. System Design

The system follows a three-tier decoupled client-server architecture designed for high maintainability, stateless backend scaling, and clear separation of concerns.

### 1. Presentation Tier (Frontend)
- **Framework**: React 18 (Single Page Application) using Vite and TypeScript.
- **Responsibilities**: UI rendering, client-side route protection, form capture with validation, and server state synchronization.
- **Location**: `client/` directory.

### 2. Application Tier (Backend REST API)
- **Framework**: Node.js and Express.js using TypeScript.
- **Responsibilities**: HTTP request routing, JWT validation, Zod payload validation, business logic, transaction management, and RBAC enforcement.
- **Location**: `server/` directory.

### 3. Persistence Tier (Database)
- **Engine**: PostgreSQL 16 on Supabase.
- **Responsibilities**: Relational data persistence, foreign key enforcement, row-level pessimistic locking, and ACID transaction isolation.
- **Driver**: Node.js `pg` library.

> [!IMPORTANT]  
> This is a **monolithic backend application** with a **separately deployed frontend**. It is **NOT** a microservices architecture.
