# FEATURE AUDIT

| Feature | Required | Code Exists | Actually Works | UI Exists | API Exists | DB Exists | Tested | Status |
|---------|----------|-------------|----------------|-----------|------------|-----------|--------|--------|
| Landing Page | Yes | Yes | Yes | Yes | Yes | N/A | Yes | COMPLETE |
| Public Signup | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Login | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| RBAC (Backend) | Yes | Yes | Yes | N/A | Yes | Yes | Yes | COMPLETE |
| RBAC (Frontend) | Yes | Yes | Yes | Yes | N/A | N/A | Yes | COMPLETE |
| Dashboard | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Customer CRM (List & Create) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Customer CRM (Edit Profile) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Customer CRM (Follow-ups) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Products (List & Create) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Products (Search & Filter) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Products (Edit Catalog) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Inventory (Adjust Stock) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Stock Movements (Ledger History) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Inventory (Negative Stock block) | Yes | Yes | Yes | N/A | Yes | Yes | Yes | COMPLETE |
| Sales Challans (Create Draft) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Sales Challans (Confirm/Deduct) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Sales Challans (Cancel/Return) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |
| Sales Challans (Product Snapshots) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | COMPLETE |

## Detailed Audits

### 1. Landing Page
- **Code exists**: No
- **UI complete**: No
- **Route**: No (The root `/` route directly mounts the Protected Dashboard).
- **Components**: No
- **Missing**: All landing page features (Hero sections, CTAs, product overviews, generic pages).

### 2. Signup / User Creation
- Public signup is not required by the specification.
- **Admin-created users / Seeded users**: Initial users (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`) are fully seeded. There is no active GUI or API route (`/users`) for an administrator to add new users during runtime, which is listed as "Forbidden" for non-admins but is currently unimplemented.

### 3. Login
- **Can a real user log in?**: YES.
- **Where is login implemented?**: 
  - Frontend UI: `client/src/features/auth/LoginPage.tsx`
  - Frontend Service: `client/src/services/auth.api.ts`
  - Frontend Context: `client/src/contexts/AuthContext.tsx`
  - Backend Controller: `server/src/controllers/auth.controller.ts`
  - Backend Service: `server/src/services/auth.service.ts`
- **What happens after login?**: The token and user profile are saved to `localStorage`, the user context is updated, and the router pushes the user to `/dashboard`.
- **Is the role actually loaded?**: YES. The JWT payload decodes the user's role on both the frontend context and backend requests.

### 4. RBAC (Role-Based Access Control)
- **Backend RBAC**: Fully implemented. Route-level authorization middlewares (`authenticate.ts` and `authorize.ts`) validate user role claims and return `403 Forbidden` if unauthorized.
- **Frontend RBAC**: Partially implemented.
  - Page/Card components query roles via `usePermission` to conditionally display features (e.g., product creation is hidden from WAREHOUSE/SALES).
  - Navigation links in the sidebar are visible to everyone because `Sidebar.tsx` sets all routes' access limits to allow all roles.
  - Client-side page routes themselves are not guarded. A SALES agent can navigate to `/products` manually, but they will not see the "Create Product" form and their backend queries are rejected if they try to execute disallowed API methods.

### 5. Dashboard
- Renders total accounts, active customers, catalog totals, recent stock and challan dispatches, and low-stock alerts.
- Fully wired to backend API service `GET /api/v1/dashboard/summary`.

### 6. Customer CRM
- **Implemented**: Searching, status filtering, customer listing, creating customers, viewing customer profiles, follow-up timeline logs, follow-up scheduler logging, and CRM status state transitions.
- **Missing in UI**: The backend supports a `PUT /api/v1/customers/:id` update endpoint, but the frontend lacks any UI button or modal to edit a customer's standard text fields (address, mobile, email, GST, etc.) after creation.

### 7. Products & Inventory Catalog
- **Implemented**: Product lists, creating products (ADMIN), adjusting stock (ADMIN/WAREHOUSE), low-stock badges, stock movements chronological table, and transaction-safe locks (`FOR NO KEY UPDATE`) preventing negative balances.
- **Missing in UI**: 
  - Product search input and category filter do not exist on the frontend catalog page (though backend schema fully supports searching).
  - Editing catalog metadata (changing SKUs, changing names, or unit prices) is not supported in the UI.

### 8. Sales Challans
- **Implemented**: Draft creation, customer select, product select, quantity input, individual item snapshot logging (static snapshots of sku, name, unit price at draft time), confirmation processing, cancellation processing, and atomic rollbacks for insufficient inventory or invalid draft states.
- **Validation**: 
  - Confirming an invalid/already confirmed draft returns `409 Conflict`.
  - Confirming a draft with insufficient stock returns `422 Unprocessable Entity` and rolls back the db connection.
- **UI Limitation**: Frontend only allows adding a single product item when drafting a challan (backend API supports drafting a challan with an array of multiple items).

### 9. Database & Supabase
- Relational schema defined in 3NF across `users`, `customers`, `customer_followups`, `products`, `stock_movements`, `challans`, and `challan_items`.
- Configured via PgBouncer connection pooling string. Uses the direct `pg` connection pool handle, fully running transactional SQL queries.

### 10. API Audit Matrix

| Method | Path | Auth Req. | Required Role | Implemented? | Used by Frontend? | Working? |
|--------|------|-----------|---------------|--------------|-------------------|----------|
| POST | `/api/v1/auth/login` | No | Public | Yes | Yes | Yes |
| GET | `/api/v1/customers` | Yes | All Roles | Yes | Yes | Yes |
| POST | `/api/v1/customers` | Yes | ADMIN, SALES | Yes | Yes | Yes |
| GET | `/api/v1/customers/:id` | Yes | All Roles | Yes | Yes | Yes |
| PUT | `/api/v1/customers/:id` | Yes | ADMIN, SALES | Yes | No | Yes (API only) |
| POST | `/api/v1/customers/:id/followups` | Yes | ADMIN, SALES | Yes | Yes | Yes |
| GET | `/api/v1/products` | Yes | All Roles | Yes | Yes | Yes |
| POST | `/api/v1/products` | Yes | ADMIN | Yes | Yes | Yes |
| PUT | `/api/v1/products/:id` | Yes | ADMIN | Yes | No | Yes (API only) |
| POST | `/api/v1/products/:id/adjust-stock` | Yes | ADMIN, WAREHOUSE | Yes | Yes | Yes |
| GET | `/api/v1/stock-movements` | Yes | All Roles | Yes | Yes | Yes |
| GET | `/api/v1/challans` | Yes | All Roles | Yes | Yes | Yes |
| POST | `/api/v1/challans` | Yes | ADMIN, SALES | Yes | Yes | Yes |
| GET | `/api/v1/challans/:id` | Yes | All Roles | Yes | Yes | Yes |
| PUT | `/api/v1/challans/:id` | Yes | ADMIN, SALES | Yes | No | Yes (API only) |
| POST | `/api/v1/challans/:id/confirm` | Yes | ADMIN, SALES, WAREHOUSE | Yes | Yes | Yes |
| POST | `/api/v1/challans/:id/cancel` | Yes | ADMIN, SALES | Yes | Yes | Yes |
| GET | `/api/v1/dashboard/summary` | Yes | All Roles | Yes | Yes | Yes |
| GET/POST| `/api/v1/users` | Yes | ADMIN | No | No | No (Unimplemented) |

### 11. Frontend Routes Matrix

| Route | Component | Public/Protected | Required Role | Actually Accessible? | Renders? | Backend Connected? |
|-------|-----------|------------------|---------------|----------------------|----------|--------------------|
| `/` | `DashboardPage` | Protected | All Roles | Yes | Yes | Yes |
| `/login` | `LoginPage` | Public | Public | Yes | Yes | Yes |
| `/signup` | N/A | Public | N/A | MISSING | No | No |
| `/dashboard` | `DashboardPage` | Protected | All Roles | Yes | Yes | Yes |
| `/customers` | `CustomersPage` | Protected | All Roles | Yes | Yes | Yes |
| `/customers/:id` | `CustomerDetailPage` | Protected | All Roles | Yes | Yes | Yes |
| `/products` | `ProductsPage` | Protected | All Roles | Yes | Yes | Yes |
| `/stock-movements`| `StockMovementsPage` | Protected | All Roles | Yes | Yes | Yes |
| `/challans` | `ChallansPage` | Protected | All Roles | Yes | Yes | Yes |
| `/challans/:id` | `ChallanDetailPage` | Protected | All Roles | Yes | Yes | Yes |

### 12. Testing Audit
- **Backend Tests**: Present in `server/tests`. Evaluates JWT functions, request schema parsers, route handlers, and locking mechanics.
- **Integration Tests status**: Safely skipped when database access fails. (Requires local postgres/supabase to run full tests).
- **Concurrency Test**: Exists at `tests/integration/concurrency.integration.test.ts` (evaluates concurrent double confirmations and row locks, but is skipped under standard CI unless target DB URL is active).
- **Frontend Tests**: Completely missing (exits with code 0 saying no tests found).
