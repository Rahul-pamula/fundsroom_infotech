# 4. Requirements

The project adheres strictly to the following functional and non-functional requirements.

## Functional Requirements

- **Authentication**: Users must be able to log in securely using seeded credentials and maintain a session via stateless JWTs.
- **Role-Based Access Control (RBAC)**: 
  - **ADMIN**: Full access.
  - **SALES**: CRM and Challan management, read-only catalog access.
  - **WAREHOUSE**: Stock adjustments, read-only Challan and Catalog access.
  - **ACCOUNTS**: Read-only access to all modules for auditing.
- **Customer Management**: Ability to create, view, and update customer profiles with states (LEAD, ACTIVE, INACTIVE).
- **Customer Follow-ups**: Logging of text-based interaction notes and scheduling future contact dates.
- **Product Management**: Ability to manage a catalog of items with SKUs, Categories, and Unit Prices.
- **Inventory**: Display real-time stock balances and trigger low-stock alerts on dashboards.
- **Stock Movements**: Manual stock adjustments (IN/OUT) with reasons.
- **Sales Challans**: 
  - Create DRAFT challans assigning a customer and product items.
  - Snapshot product name, SKU, and price at the time of drafting.
  - CONFIRM challans to deduct stock.
  - CANCEL challans to void drafts or restock confirmed items.
- **Dashboard**: Provide a top-level summary of operational metrics.

## Non-Functional Requirements

- **Security**: Prevent SQL injection via parameterized queries. Protect against XSS and CSRF (via proper header controls and local storage scoping). Provide rate-limiting on authentication routes.
- **Performance**: Use database indexes for fast query resolution. Implement TanStack Query caching on the frontend to reduce unnecessary network requests.
- **Reliability**: All stock deductions must occur within ACID-compliant PostgreSQL transactions.
- **Maintainability**: Follow Clean Architecture in the backend (Routes → Controllers → Services → Repositories).
- **Responsive UI**: The client application must render correctly on mobile, tablet, and desktop viewports.
- **Concurrency Safety**: Implement explicit row locking to prevent race conditions during order confirmations.
