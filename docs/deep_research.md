Mini ERP + CRM Operations Portal: System Design Architecture DocumentSystem OverviewThe Mini ERP + CRM Operations Portal is a software platform designed specifically for small-to-medium wholesale and distribution businesses. The platform bridges essential operational functions across sales teams, warehouse personnel, accounts departments, and executive administration. Core operational workflows encompass managing customer lifecycles and sales leads, maintaining product master catalogs, logging stock movements across storage locations, and orchestrating the sales fulfillment process through sales challans.Designed to satisfy the technical evaluation specifications of a full-stack engineering assessment, the system prioritizes transactional integrity, strict role-based access control, auditable stock accounting, and high operational throughput. The primary business challenge addressed by this architecture centers on inventory consistency during concurrent order processing: ensuring that stock deductions are executed atomically, inventory balances cannot fall below zero under any load conditions, historical transaction line items remain immutable despite master catalog modifications, and every state transition is strictly authorized and recorded.The architectural blueprint detailed herein outlines a decoupled single-page client application communicating with a stateless REST API backend backed by a relational PostgreSQL database on Supabase. The system design is structured to be realistically buildable within a 48-hour implementation timeline while maintaining production-grade standards.High-Level ArchitectureThe system follows a three-tier decoupled client-server architecture designed for high maintainability, stateless backend scaling, and clear separation of concerns.The presentation tier consists of a single-page React application written in TypeScript. The application executes entirely within the browser client, managing user interface rendering, client-side route protection, form validation, and asynchronous state synchronization.The application tier comprises a stateless Node.js and Express REST API service written in TypeScript. This layer handles request routing, JSON Web Token (JWT) verification, role-based authorization, request payload validation, domain business logic execution, transaction management, and centralized error logging.The persistence tier utilizes a PostgreSQL relational database hosted on Supabase. Database access is managed directly from the Express service layer using direct TCP connection pooling. Relational integrity, data constraints, row-level pessimistic locking, and ACID transaction isolation are enforced at this layer.Client Tier (Browser)
└─ React + TypeScript SPA
   ├─ Client-Side Routing (React Router)
   ├─ Server State Management (TanStack Query)
   └─ REST API Client (Axios)
      │
      │ HTTPS / REST (JSON API Payload)
      │ Bearer Token Authorization
      ▼
Application Tier (Express Server)
└─ Node.js + Express API Engine
   ├─ Security & Rate Limiting Middleware
   ├─ Authentication & RBAC Middleware
   ├─ Zod Schema Validation Layer
   ├─ Service & Domain Logic Engine
   └─ PostgreSQL Connection Pool
      │
      │ Native PostgreSQL Wire Protocol (TCP Port 6543)
      │ PgBouncer Transaction Pooler
      ▼
Persistence Tier (Supabase)
└─ Managed PostgreSQL Database
   ├─ Relational Tables & Primary/Foreign Key Constraints
   ├─ Row-Level Pessimistic Locking (SELECT FOR NO KEY UPDATE)
   └─ B-Tree Indexes & Check Constraints
Component communications are strictly unidirectional and request-driven:Client to Backend Communication: The client issues RESTful HTTP requests over TLS. Requests carry JSON payloads and transmit authentication claims via standard Authorization: Bearer <token> HTTP headers.Backend to Database Communication: The Express API server connects to Supabase PostgreSQL using a pooled database driver. Transactions are managed explicitly through database connection handles, guaranteeing atomic commits and rollbacks across multiple operations.External Service Dependencies: The platform is self-contained. Deployment targets rely on Vercel or Netlify for static frontend asset delivery, Render or Railway for Node.js application hosting, and Supabase for cloud database management.Architecture TierComponent TechnologyResponsibility DescriptionDeployment TargetPresentation TierReact 18, TypeScript, TanStack Query, Tailwind CSSUI rendering, client state management, form capture, role-based view guarding.Vercel / Netlify CDNApplication TierNode.js, Express.js, TypeScript, Zod, JsonWebTokenHTTP request routing, JWT validation, RBAC enforcement, business domain services, database transaction orchestration.Render / Railway Web ServicePersistence TierPostgreSQL 16 on Supabase, PgBouncerRelational data persistence, foreign key enforcement, row-level locking, ACID compliance, transaction isolation.Supabase Cloud DatabaseTechnology Architecture & Trade-OffsSelecting the operational stack requires evaluating development velocity, runtime stability, cold-start performance on free-tier hosting platforms, and alignment with the assignment specifications.Architecture DomainRecommended TechnologyAlternative ChoiceTrade-Off & Selection RationaleFrontend FrameworkReact (SPA) with Vite & TypeScriptNext.js (App Router)Selected: React SPA provides standard client-side routing, simpler state management, zero server-side rendering (SSR) overhead, and fast build times.Trade-Off: Lacks native SSR for SEO, which is completely unnecessary for an internal corporate operations portal.Backend FrameworkExpress.js with TypeScriptNestJSSelected: Express.js with Clean Layered Architecture offers rapid setup, minimal boilerplate, low memory usage, and near-instant cold-starts on free hosting tiers.Trade-Off: Lacks built-in dependency injection structures present in NestJS, requiring explicit directory conventions.Database EnginePostgreSQL on SupabaseMySQL / Native Self-Hosted PostgresSelected: Supabase provides managed PostgreSQL, automated backups, integrated PgBouncer connection pooling, and straightforward SQL migration tooling.Trade-Off: Creates a cloud platform dependency, mitigated by accessing the underlying PostgreSQL instance via standard TCP database connection strings.Authentication StrategyCustom JWT via Express EngineSupabase Auth (GoTrue)Selected: Custom JWT generation inside the Express backend centralizes business logic, role-based claim handling, and authorization rules within API code.Trade-Off: Requires writing explicit password hashing (bcrypt) and token generation routines, but avoids synchronization frictions between Supabase Row Level Security (RLS) and Express middleware.Server State ManagerTanStack Query (v5)Redux ToolkitSelected: Simplifies API data caching, background revalidation, loading/error states, and cache invalidation after inventory mutations.Trade-Off: Dedicated learning curve for cache key structures, but dramatically reduces UI state boilerplate.Frontend ArchitectureThe frontend application uses a feature-modular directory structure. Instead of grouping files strictly by technical role (e.g., all components in one folder, all pages in another), code is isolated by business domain, increasing developer efficiency and component encapsulation.Client Directory Layoutsrc/assets/: Static imagery, branding assets, and global stylesheet definitions.src/components/common/: Reusable, domain-agnostic UI widgets (buttons, data tables, modals, badges, inputs).src/components/layout/: Application layout shells, header bars, sidebar navigation panels, and page wrappers.src/components/feedback/: Alert banners, toast notification handlers, skeleton loaders, and error boundaries.src/config/: Environment variable bindings, API endpoint constants, and global application options.src/contexts/: React context providers for global client state (Authentication Context, Theme Context).src/features/auth/: Login pages, credential forms, token storage handlers, and auth utilities.src/features/crm/: Customer directory views, client creation forms, detail inspection pages, and follow-up timeline components.src/features/inventory/: Product catalog grids, stock movement ledgers, low-stock alert views, and stock adjustment modals.src/features/challans/: Sales challan creation wizards, line item tables, stock validation indicators, and status action components.src/features/dashboard/: Executive summary KPIs, critical stock warning boards, and quick-action launcher widgets.src/hooks/: Custom utility hooks (useAuth, usePermission, useDebounce, useToast).src/routes/: Router manifest definitions, authenticated route guards, and role-based access wrappers.src/services/: Centralized HTTP client setup (Axios instance, request authorization interceptors, response error interceptors).src/types/: TypeScript interface definitions, domain model entities, and API payload structures.src/utils/: Currency formatters, date manipulators, client storage wrappers, and validation helpers.Client Routing & Access Control MechanicsClient-side routing is managed by React Router (v6). The application layout enforces strict route protection through hierarchical wrapper components:Public Route Boundary: Renders unauthenticated routes (e.g., /login). If an authenticated user attempts to access /login, the route guard automatically redirects them to /dashboard.Protected Route Boundary: Intercepts requests to internal routes. It verifies the presence and expiration time of the JWT in client storage. If the token is missing or expired, the user is redirected to /login with a return location parameter.Role Guard Boundary: Wraps domain routes and evaluates the current user's role against the route's required roles. If a SALES user attempts to navigate to /products/new (an ADMIN-only route), the component blocks rendering and displays a 403 Access Denied UI view.Form Management & UI State SynchronisationForms are constructed using React Hook Form coupled with Zod schema validation models. Client-side input validation executes synchronously on blur or submit, displaying immediate field-level error prompts before any network request is sent. Server state synchronization uses TanStack Query. Mutations (such as confirming a sales challan) automatically trigger targeted query cache invalidations (invalidateQueries(['products']), invalidateQueries(['challans'])), ensuring the inventory catalog and order list UI reflect updated balances without requiring full page refreshes.Backend ArchitectureThe backend API follows Clean Layered Architecture guidelines, keeping dependencies strictly unidirectional: Route -> Controller -> Service -> Repository -> Database.Incoming HTTP Request
   │
   ▼
Routes Layer (URI Matching & Middleware Attachment)
   │
   ▼
Middleware Stack (Rate Limiting ──► JWT Auth ──► RBAC Check ──► Zod Payload Validation)
   │
   ▼
Controllers Layer (Extract Request Params/Body ──► Delegate Execution ──► Format HTTP Response)
   │
   ▼
Services Layer (Pure Business Logic ──► Transaction Boundaries ──► Cross-Entity Rules)
   │
   ▼
Repositories Layer (Parameterized SQL Queries ──► PostgreSQL Execution ──► Object Mapping)
   │
   ▼
PostgreSQL Database
Backend Directory Layoutserver/src/config/: Database pool initialization, environment variable parsing, runtime constants.server/src/controllers/: HTTP payload processing handlers, response status code mappings.server/src/middleware/: Authentication interceptors, authorization checks, payload validation drivers, central error handlers.server/src/models/: Zod request schemas, database entity types, domain event models.server/src/repositories/: Parameterized SQL query abstractions, data access objects, direct database client interactions.server/src/routes/: Express router modules declaring path mappings and middleware stacks.server/src/services/: Core domain business logic, transactional orchestrations, stock check assertions.server/src/utils/: Cryptographic hashing tools, token sign/verify utilities, custom error class definitions.server/db/migrations/: Sequential SQL DDL migration files.server/db/seeds/: Initial data seeding scripts (default administrative accounts, initial categories).Response & Error StandardizationThe backend enforces a consistent JSON response layout across all endpoints. Success payloads return HTTP 200/201 status codes accompanied by the following structure:JSON{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  },
  "timestamp": "2026-03-30T10:15:30.123Z"
}
Failed requests return appropriate 4xx/5xx HTTP status codes with a structured error payload:JSON{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Requested quantity (15) exceeds available stock (5) for SKU-1002",
    "details": []
  },
  "timestamp": "2026-03-30T10:15:30.123Z"
}
Database Architecture & ER DiagramThe database architecture is designed in Third Normal Form (3NF) to eliminate data redundancy while maintaining transactional integrity. Database primary keys use Universally Unique Identifiers (UUIDv4) generated via PostgreSQL's native gen_random_uuid() function, preventing key enumeration attacks and allowing safe client-side ID generation if needed.Database Entity Relational Mapusers (1) ─── holds creation relationship ─── (N) customers[cite: 1, 2]users (1) ─── holds author relationship ─── (N) customer_followups[cite: 1, 2]users (1) ─── holds creation relationship ─── (N) stock_movements[cite: 1, 3]users (1) ─── holds creation relationship ─── (N) challans[cite: 1, 7]customers (1) ─── holds history relationship ─── (N) customer_followups[cite: 2]customers (1) ─── holds order relationship ─── (N) challans[cite: 2, 7]products (1) ─── holds ledger relationship ─── (N) stock_movements[cite: 3]products (1) ─── holds line item reference ─── (N) challan_items[cite: 3]challans (1) ─── owns item composition ─── (N) challan_items[cite: 3, 7]Table Structural Specifications1. Users Table (users)Stores system operators, hashed security credentials, and assigned application roles.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()System-wide unique user identifier.emailVARCHAR(255)UNIQUE, NOT NULLAccount login email address.password_hashVARCHAR(255)NOT NULLBcrypt hashed account password.full_nameVARCHAR(100)NOT NULLUser's full display name.roleVARCHAR(20)NOT NULL, CHECK (role IN ('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'))Access control role assignment.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()System record creation timestamp.updated_atTIMESTAMPTZNOT NULL, DEFAULT NOW()System record update timestamp.2. Customers Table (customers)Stores customer accounts, commercial classifications, contact details, and follow-up schedules.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique customer identifier.nameVARCHAR(100)NOT NULLContact person's full name.mobileVARCHAR(20)NOT NULLPrimary contact phone number.emailVARCHAR(255)NOT NULLCustomer email address.business_nameVARCHAR(150)NOT NULLRegistered commercial entity name.gst_numberVARCHAR(15)NULLABLEOptional tax registration GST identification.customer_typeVARCHAR(20)NOT NULL, CHECK (customer_type IN ('RETAIL', 'WHOLESALE', 'DISTRIBUTOR'))Commercial classification.addressTEXTNOT NULLBilling and delivery physical address.statusVARCHAR(20)NOT NULL, CHECK (status IN ('LEAD', 'ACTIVE', 'INACTIVE'))Customer relationship status.follow_up_dateDATENULLABLENext scheduled follow-up date.notesTEXTNULLABLEGeneral customer comments.created_byUUIDNOT NULL, FOREIGN KEY -> users(id)Foreign key targeting the creator.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Timestamp of record creation.updated_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Timestamp of record update.3. Customer Follow-up Logs Table (customer_followups)Stores an auditable timeline of interactions and follow-ups for each customer.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique follow-up entry ID.customer_idUUIDNOT NULL, FOREIGN KEY -> customers(id) ON DELETE CASCADEParent customer reference.noteTEXTNOT NULLDetailed log of the conversation or interaction.follow_up_dateDATENULLABLENext follow-up date set during this interaction.created_byUUIDNOT NULL, FOREIGN KEY -> users(id)Author of the follow-up entry.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Interaction log timestamp.4. Products Table (products)Stores master product catalog items, warehouse locations, pricing, and available inventory levels.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique product identifier.nameVARCHAR(150)NOT NULLProduct catalog display name.skuVARCHAR(50)UNIQUE, NOT NULLStock Keeping Unit code.categoryVARCHAR(50)NOT NULLProduct category grouping.unit_priceNUMERIC(12,2)NOT NULL, CHECK (unit_price >= 0)Selling price per unit.current_stockINTNOT NULL, CHECK (current_stock >= 0)Available inventory balance; prevents negative stock.min_stock_alertINTNOT NULL, DEFAULT 10, CHECK (min_stock_alert >= 0)Threshold quantity for low-stock alerts.locationVARCHAR(100)NOT NULLWarehouse aisle/bin storage location.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Catalog record creation timestamp.updated_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Catalog record update timestamp.5. Stock Movements Table (stock_movements)Provides an immutable ledger tracking all stock increments and decrements for audit purposes.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique ledger entry identifier.product_idUUIDNOT NULL, FOREIGN KEY -> products(id)Target product reference.quantityINTNOT NULL, CHECK (quantity > 0)Absolute quantity changed.movement_typeVARCHAR(10)NOT NULL, CHECK (movement_type IN ('IN', 'OUT'))Direction of inventory flow.reasonVARCHAR(100)NOT NULLBusiness reason for movement.reference_typeVARCHAR(20)NOT NULL, CHECK (reference_type IN ('CHALLAN', 'MANUAL_ADJUSTMENT', 'PURCHASE_ORDER'))Transaction type origin.reference_idUUIDNULLABLEAssociated entity ID (e.g., challan_id).created_byUUIDNOT NULL, FOREIGN KEY -> users(id)Operator who executed movement.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Timestamp of stock change.6. Challans Table (challans)Manages sales challan header records and lifecycle states.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique internal challan identifier.challan_numberVARCHAR(50)UNIQUE, NOT NULLAuto-generated document number.customer_idUUIDNOT NULL, FOREIGN KEY -> customers(id)Target customer account reference.total_quantityINTNOT NULL, DEFAULT 0, CHECK (total_quantity >= 0)Summed quantity across all line items.statusVARCHAR(20)NOT NULL, DEFAULT 'DRAFT', CHECK (status IN ('DRAFT', 'CONFIRMED', 'CANCELLED'))Current transaction lifecycle state.created_byUUIDNOT NULL, FOREIGN KEY -> users(id)Operator who generated the draft.confirmed_byUUIDNULLABLE, FOREIGN KEY -> users(id)Operator who confirmed fulfillment.confirmed_atTIMESTAMPTZNULLABLEFulfillment confirmation timestamp.created_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Record creation timestamp.updated_atTIMESTAMPTZNOT NULL, DEFAULT NOW()Record modification timestamp.7. Challan Items Table (challan_items)Stores individual line items within a sales challan, preserving immutable product snapshots.Column NameData TypeConstraint RulesAttribute Function DescriptionidUUIDPRIMARY KEY, DEFAULT gen_random_uuid()Unique line item identifier.challan_idUUIDNOT NULL, FOREIGN KEY -> challans(id) ON DELETE CASCADEParent challan header reference.product_idUUIDNOT NULL, FOREIGN KEY -> products(id)Master catalog product reference.quantityINTNOT NULL, CHECK (quantity > 0)Ordered line item quantity.snapshot_product_nameVARCHAR(150)NOT NULLImmutable snapshot of product name.snapshot_skuVARCHAR(50)NOT NULLImmutable snapshot of product SKU.snapshot_unit_priceNUMERIC(12,2)NOT NULL, CHECK (snapshot_unit_price >= 0)Immutable snapshot of unit price.Database Indexing PlanIndexes target foreign key columns, unique lookups, and heavily queried filter targets to maintain low latency as data grows:Index IdentifierTarget Database TableIndexed ColumnsPrimary Query Purposeidx_customers_statuscustomersstatusFilters directory listings by active/lead status.idx_customers_mobilecustomersmobileAccelerates customer lookups by phone number.idx_products_skuproductsskuDirect lookup index for product SKUs.idx_products_categoryproductscategoryAccelerates category filtering in catalog views.idx_challans_numberchallanschallan_numberRapid document lookup by challan number.idx_challans_statuschallansstatusFilters draft vs confirmed sales challans.idx_stock_movements_pidstock_movementsproduct_id, created_at DESCRenders product stock history in reverse chronological order.idx_challan_items_cidchallan_itemschallan_idJoins line items to parent challan header.Authentication ArchitectureAuthentication uses stateless JSON Web Tokens (JWT) managed by the Express backend API.Authentication MechanicsCredential Submission: The user submits their email address and plain-text password to POST /api/v1/auth/login.Identity Verification: The API service queries the users table for the matching email. If found, bcrypt.compare() evaluates the submitted password against the stored password_hash.Token Issuance: Upon verification, the backend mints a signed JWT using a cryptographically secure secret key (JWT_SECRET). The token payload includes the user ID, email address, and assigned system role.Client Token Management: The signed token is returned in the HTTP response body. The client stores the token in localStorage or sessionStorage and attaches it to all subsequent API requests via the standard HTTP header: Authorization: Bearer <token>.Middleware Validation: The Express authenticate middleware intercepts incoming requests, verifies the JWT signature using the shared secret, checks for token expiration, and attaches the decoded user payload (req.user) to the Express request context.JSON{
  "sub": "u481f9a2-231b-4831-92cd-290091811a2f",
  "email": "sales.manager@company.com",
  "role": "SALES",
  "iat": 1774864800,
  "exp": 1774908000
}
Tokens are configured with a 12-hour lifespan (JWT_EXPIRES_IN=12h), matching typical shift lengths while reducing the vulnerability window of compromised client tokens.Authorization MatrixThe backend enforces Role-Based Access Control (RBAC) via middleware guards (authorize(['ADMIN', 'SALES'])).Application Endpoint / Operation PathAdmin RoleSales RoleWarehouse RoleAccounts RolePOST /api/v1/auth/loginPermittedPermittedPermittedPermittedCustomer CRM ModuleGET /api/v1/customersPermittedPermittedPermittedPermittedPOST /api/v1/customersPermittedPermittedForbiddenForbiddenPUT /api/v1/customers/:idPermittedPermittedForbiddenForbiddenPOST /api/v1/customers/:id/followupsPermittedPermittedForbiddenForbiddenInventory & Products ModuleGET /api/v1/productsPermittedPermittedPermittedPermittedPOST /api/v1/productsPermittedForbiddenForbiddenForbiddenPUT /api/v1/products/:idPermittedForbiddenForbiddenForbiddenPOST /api/v1/products/:id/adjust-stockPermittedForbiddenPermittedForbiddenGET /api/v1/stock-movementsPermittedPermittedPermittedPermittedSales Challan ProcessingGET /api/v1/challansPermittedPermittedPermittedPermittedPOST /api/v1/challansPermittedPermittedForbiddenForbiddenPUT /api/v1/challans/:id (Draft Mode)PermittedPermittedForbiddenForbiddenPOST /api/v1/challans/:id/confirmPermittedPermittedPermittedForbiddenPOST /api/v1/challans/:id/cancelPermittedPermittedForbiddenForbiddenSystem AdministrationGET / POST /api/v1/usersPermittedForbiddenForbiddenForbiddenCustomer CRM ArchitectureThe CRM module manages the customer lifecycle across three distinct operational states: LEAD, ACTIVE, and INACTIVE.Customer Lifecycle States:
Lead Acquisition ──► Follow-up Interaction Logging ──► Conversion to Active Customer ──► Sales Order Execution
CRM Execution SequencesLead Capture: A user with the ADMIN or SALES role submits the customer creation form (POST /api/v1/customers). Required attributes include the customer's full name, business name, mobile number, email, address, and initial status (default: LEAD).Follow-up Schedule Tracking: Sales representatives use a dedicated dashboard widget that queries upcoming follow-ups sorted by follow_up_date.Interaction Logging: When contacting a client, the sales representative adds notes via the customer detail page (POST /api/v1/customers/:id/followups). This action creates an immutable log entry in customer_followups and atomically updates customers.follow_up_date and customers.status within a single database transaction.Directory Search & Filtering: The search bar triggers debounced requests to GET /api/v1/customers?search=value. The backend queries name, business_name, and mobile using case-insensitive SQL matching (ILIKE), combined with explicit status filter checks.Inventory ArchitectureThe inventory engine tracks stock balances, warehouse storage bin locations, and minimum-stock thresholds to prevent stockouts.Inventory Accounting RulesStock Movements: Inventory modifications require explicit ledger entries in stock_movements. Direct updates to products.current_stock without an accompanying ledger entry are blocked by the service layer.Movement Classification:IN Movements: Increment products.current_stock (e.g., initial catalog seeding, manual stock adjustments, supplier purchase order receipts).OUT Movements: Decrement products.current_stock (e.g., confirmed sales challan dispatch, damaged stock write-offs).Low Stock Alert System: Catalog views evaluate product stock levels against alert thresholds (current_stock <= min_stock_alert). Low-stock items are highlighted in the UI and featured in executive dashboard summaries.Sales Challan Architecture & Concurrency StrategyThe sales challan workflow is the central transaction engine of the platform. It translates pending draft orders into confirmed fulfillment records while guaranteeing inventory consistency.Fulfillment Sequence StepsStep 1: Create Draft Challan Header (Status = DRAFT)
Step 2: Assign Customer Account & Product Line Items
Step 3: Capture Product Snapshots (Name, SKU, Unit Price)
Step 4: Execute Confirmation Request (POST /challans/:id/confirm)
Step 5: Open PostgreSQL Database Transaction (BEGIN)
Step 6: Acquire Row-Level Locks on Products (SELECT FOR NO KEY UPDATE)
Step 7: Assert Available Stock >= Requested Quantity
Step 8: Deduct Stock Balances & Insert OUT Stock Movement Logs
Step 9: Transition Challan Header Status to CONFIRMED
Step 10: Commit PostgreSQL Database Transaction (COMMIT)
PostgreSQL Transaction & Concurrency Locking StrategyA primary technical challenge in inventory management is preventing race conditions, lost updates, and negative stock balances when multiple users confirm orders containing overlapping products simultaneously.To resolve race conditions, the platform executes challan confirmations inside PostgreSQL transactions using pessimistic explicit row locking (SELECT FOR NO KEY UPDATE) under the default READ COMMITTED isolation level.Step-by-Step Transaction Confirmation AlgorithmOpen Database Transaction: The service layer obtains a dedicated connection handle from the pool and issues a BEGIN TRANSACTION; command.Verify Challan State: The backend reads the target challan header:SQLSELECT id, status FROM challans WHERE id = $1 FOR UPDATE;
If the returned status is not DRAFT, the transaction immediately aborts (ROLLBACK;) and returns an HTTP 409 Conflict error to prevent duplicate confirmations.Fetch & Sort Line Items: Line items associated with the challan are retrieved. Product IDs are sorted in ascending string order (ORDER BY product_id ASC) prior to lock acquisition.Architectural Rationale: Sorting resource keys deterministically across all transactions prevents cross-transaction deadlocks when concurrent requests attempt to lock the same set of products in different sequences.Acquire Row Locks & Validate Stock Balances:
For each product line item in the sorted set, the server locks the product row:SQLSELECT id, sku, current_stock FROM products WHERE id = $1 FOR NO KEY UPDATE;
Using FOR NO KEY UPDATE locks the target product row against concurrent updates while allowing non-conflicting foreign key checks on non-primary key columns.If current_stock < requested_quantity, the transaction issues a ROLLBACK; and throws an InsufficientStockError (HTTP 422 Unprocessable Entity) specifying the SKU, available stock, and requested quantity.Deduct Inventory & Write Ledger Entries:
Once all line items are validated, stock balances are decremented and movement logs are created within the transaction:SQLUPDATE products 
SET current_stock = current_stock - $1, updated_at = NOW() 
WHERE id = $2;

INSERT INTO stock_movements (product_id, quantity, movement_type, reason, reference_type, reference_id, created_by)
VALUES ($2, $1, 'OUT', 'Sales Challan Fulfillment', 'CHALLAN', $3, $4);
Transition Header State:SQLUPDATE challans 
SET status = 'CONFIRMED', confirmed_by = $1, confirmed_at = NOW(), updated_at = NOW() 
WHERE id = $2;
Commit Transaction: The service executes COMMIT;. Database locks are released, and the inventory deductions become permanent.Immutable Product Line Item SnapshotsTo ensure historical sales challans remain unchanged even if master product catalog details (such as product name or unit price) are updated later, the challan_items table captures static snapshots of key product fields (snapshot_product_name, snapshot_sku, snapshot_unit_price) at the moment line items are added.REST API Architecture & SpecificationThe REST API uses standard HTTP verbs, path variables for resource identification, query parameters for pagination/filtering, and consistent JSON payloads.API Endpoint SpecificationsHTTP VerbEndpoint PathAuth Req.Required RoleSummary & Expected Response PayloadPOST/api/v1/auth/loginNonePublicAuthenticates credentials and returns a JWT token.GET/api/v1/customersRequiredAll RolesLists customers with search/filter pagination.POST/api/v1/customersRequiredAdmin, SalesCreates a new customer account record.GET/api/v1/customers/:idRequiredAll RolesRetrieves full customer profile and follow-up history.PUT/api/v1/customers/:idRequiredAdmin, SalesUpdates existing customer details.POST/api/v1/customers/:id/followupsRequiredAdmin, SalesAdds a follow-up note and updates follow-up date.GET/api/v1/productsRequiredAll RolesRetrieves product catalog with stock status.POST/api/v1/productsRequiredAdminAdds a new product to the catalog.PUT/api/v1/products/:idRequiredAdminUpdates product details and pricing.POST/api/v1/products/:id/adjust-stockRequiredAdmin, WarehouseExecutes manual stock intake/outtake adjustments.GET/api/v1/stock-movementsRequiredAll RolesLists chronological stock movement log.GET/api/v1/challansRequiredAll RolesLists sales challans filtered by status/customer.POST/api/v1/challansRequiredAdmin, SalesCreates a draft sales challan with line item snapshots.GET/api/v1/challans/:idRequiredAll RolesRetrieves full challan details and snapshot items.POST/api/v1/challans/:id/confirmRequiredAdmin, Sales, WarehouseConfirms draft challan and executes stock deduction.POST/api/v1/challans/:id/cancelRequiredAdmin, SalesCancels a draft or confirmed sales challan.GET/api/v1/dashboard/summaryRequiredAll RolesReturns overall metrics, stock warnings, and recent activity.Request & Response Payload ExamplesPOST /api/v1/auth/loginJSON// Request Payload
{
  "email": "sales.agent@company.com",
  "password": "SecurePassword123!"
}

// Response Payload (200 OK)
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "e812a32c-5511-4831-92cd-290091811a2f",
      "email": "sales.agent@company.com",
      "fullName": "Jane Doe",
      "role": "SALES"
    }
  },
  "timestamp": "2026-03-30T10:15:30.123Z"
}
POST /api/v1/challansJSON// Request Payload
{
  "customerId": "c92a1840-1122-3344-5566-778899aabbcc",
  "items": [
    { "productId": "p1019283-8899-4111-a222-333344445555", "quantity": 10 },
    { "productId": "p4059681-9900-4222-b333-444455556666", "quantity": 5 }
  ]
}

// Response Payload (201 Created)
{
  "success": true,
  "data": {
    "id": "ch-991823-1122-3344-5566-778899001122",
    "challanNumber": "CH-202603-0042",
    "customerId": "c92a1840-1122-3344-5566-778899aabbcc",
    "totalQuantity": 15,
    "status": "DRAFT",
    "items": [
      {
        "id": "ci-00112233-4455-6677-8899-aabbccddeeff",
        "productId": "p1019283-8899-4111-a222-333344445555",
        "quantity": 10,
        "snapshotProductName": "Heavy Duty Steel Fastener",
        "snapshotSku": "FAST-STL-001",
        "snapshotUnitPrice": 45.50
      }
    ]
  },
  "timestamp": "2026-03-30T10:16:00.000Z"
}
Business Logic RulesThe application layer enforces specific domain rules across module boundaries:Stock Balance Check: A challan cannot transition from DRAFT to CONFIRMED if any requested line item quantity exceeds available products.current_stock.Draft Modifiability: Line items and customer assignments can only be updated while the challan is in DRAFT status. Once CONFIRMED, line items become strictly read-only.Challan Cancellation Policy:Cancelling a DRAFT challan updates its status to CANCELLED with zero inventory impact.Cancelling a CONFIRMED challan executes an atomic IN stock movement inside a transaction, restoring deducted stock balances back to inventory and logging a Stock Cancellation Return movement entry.Duplicate Confirmation Safeguard: If a confirmation request is submitted for a challan already marked CONFIRMED, the transaction aborts with an HTTP 409 Conflict error.Error Handling ArchitectureApplication errors are managed using a unified exception hierarchy derived from a custom AppError base class. This structure guarantees consistent HTTP response payloads across all error scenarios while preventing leakages of sensitive stack traces.Exception Class NameHTTP Status CodeBusiness Failure CauseValidationError400 Bad RequestPayload failed Zod schema checks or malformed JSON syntax.AuthenticationError401 UnauthorizedMissing, expired, or cryptographically invalid JWT token.AuthorizationError403 ForbiddenUser role lacks permission for the target route/action.NotFoundError404 Not FoundTargeted resource UUID does not exist in the database.ConflictError409 ConflictDuplicate unique key violation or invalid state transition (e.g., confirming a non-draft challan).InsufficientStockError422 Unprocessable EntityRequested quantity exceeds available stock balance during confirmation.InternalServerError500 Server ErrorUnhandled runtime exception or database connectivity loss.Security ArchitectureThe security framework combines network protection, application-level defenses, and data privacy safeguards:Input Sanitization: Request bodies, route parameters, and query parameters are validated at the routing boundary using Zod schemas before hitting controller logic. Unrecognized fields are automatically stripped.SQL Injection Prevention: All database interactions use parameterized SQL statements ($1, $2) or type-safe query builders. Dynamic SQL string concatenation is strictly forbidden.CORS Configuration: The Express server restricts Cross-Origin Resource Sharing (CORS) strictly to trusted domain origins configured via CLIENT_URL.Security Header Injection: Helmet.js is mounted on Express to strip X-Powered-By headers, enforce HTTP Strict Transport Security (HSTS), prevent MIME-type sniffing, and configure frame option headers.Brute-Force Defense: Public endpoints (such as POST /api/v1/auth/login) are protected using express-rate-limit, capping requests at 10 attempts per minute per client IP address.Supabase ArchitectureThe application uses Supabase strictly as a managed PostgreSQL hosting platform.Auth Strategy Comparison: Rather than using Supabase Auth (GoTrue), authentication is handled via custom JWT generation inside the Express API service. This keeps all authorization logic, role handling, and custom business rules centralized in backend TypeScript code, avoiding synchronization complexity with Supabase Row Level Security (RLS) policies.Database Connection Pooling: Connection handling routes through Supabase's integrated PgBouncer Transaction Connection Pooler (Port 6543). This prevents dynamic backend API instances on platforms like Render from exhausting available database connection limits.Database Migration Strategy: Schema migrations are managed via raw, version-controlled SQL migration files stored in server/db/migrations/. These migrations are executed sequentially during deployment builds using custom migration scripts.Deployment ArchitectureThe application uses free-tier cloud platforms configured for automated deployments triggered by repository pushes.Development Workstation
└─ Git Repository (Push to 'main' branch)
   ├─ Trigger 1 ──► Vercel Build Pipeline ──► Host Frontend Static SPA Assets
   └─ Trigger 2 ──► Render Build Pipeline ──► Host Node.js Express API Web Service
                                                   │
                                                   │ Connect via TCP (Port 6543)
                                                   ▼
                                        Supabase Cloud PostgreSQL Database
Environment Variable ConfigurationsBackend Environment Variables (server/.env)NODE_ENV: Runtime mode setting (production / development).PORT: Internal server listening port (default: 5000).DATABASE_URL: Connection string pointing to Supabase PgBouncer pooler (postgres://...:6543/postgres?pgbouncer=true).JWT_SECRET: High-entropy secret key for signing JWTs.JWT_EXPIRES_IN: Session token duration string (12h).CLIENT_URL: Allowed frontend origin for CORS validation (https://mini-erp-crm.vercel.app).Frontend Environment Variables (client/.env)VITE_API_BASE_URL: Base HTTP path to deployed backend REST API (https://mini-erp-api.onrender.com/api/v1).Testing StrategyThe testing architecture uses Vitest and Supertest to evaluate business logic, API endpoints, and transaction concurrency handling.Testing Pipeline Structure:
Unit Tests (Zod Schemas & Domain Logic) 
  ──► Integration Tests (HTTP Endpoint Authentication & RBAC Checks) 
  ──► Concurrency Tests (Simulated Parallel Transactions on Inventory)
Critical Concurrency & Inventory Test CasesInsufficient Stock Prevention Test: Asserts that attempting to confirm a challan requesting 10 units when available stock is 5 fails with an HTTP 422 Unprocessable Entity error and leaves product stock balances unchanged.Concurrent Order Confirmation Simulation: Fires multiple parallel POST /api/v1/challans/:id/confirm requests using Promise.all() against overlapping inventory. Verifies that PostgreSQL pessimistic row locking (SELECT FOR NO KEY UPDATE) processes confirmations sequentially, preventing negative balances or race conditions.Duplicate Confirmation Prevention Test: Verifies that submitting a second confirmation request for an already CONFIRMED challan triggers an HTTP 409 Conflict response.Role Authorization Enforcement Test: Verifies that a user logged in with a SALES role receives an HTTP 403 Forbidden response when attempting to call POST /api/v1/products.Docker Architecture & CI/CD RecommendationArchitectural AssessmentFor a 48-hour evaluation assignment, containerizing local development environments with Docker Compose is recommended to ensure environment consistency across systems. However, for production hosting, relying on native cloud build pipelines (such as Vercel Git Integration and Render Automated Builds) avoids unnecessary deployment complexity while remaining completely within free tier limits.Local Docker Environment SetupServer Build Dockerfile (server/Dockerfile)DockerfileFROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
Development Multi-Container Composition (docker-compose.yml)YAMLversion: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DATABASE_URL=postgres://postgres:postgres@postgres_db:5432/minierp
      - JWT_SECRET=dev_secret_key_12345
      - CLIENT_URL=http://localhost:5173
    depends_on:
      - postgres_db

  postgres_db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: minierp
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
GitHub Actions CI WorkflowA lightweight workflow script (.github/workflows/ci.yml) runs linting, type checks, and unit tests on pushes to the repository:YAMLname: Continuous Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Project Dependencies
        run: |
          cd server && npm ci
          cd ../client && npm ci

      - name: Typecheck and Test Backend
        run: |
          cd server
          npm run typecheck
          npm test
Scalability ConsiderationsThe system design accommodates future feature additions without requiring breaking architectural rewrites:Multi-Warehouse Inventory Support: The current single-location model (products.location) can be expanded by introducing a warehouses master entity and replacing direct stock balance fields with a warehouse_inventory junction table.Commercial Billing Flow Integration: Confirmed sales challans can serve as source records for generating tax invoices (invoices table), tracking accounts receivable, and accepting partial payments.Asynchronous Background Task Processing: Heavy asynchronous tasks (such as rendering PDF challan documents or dispatching email alerts) can be offloaded to background worker queues powered by Redis and BullMQ, keeping HTTP response times low.Complete Project Folder Structuremini-erp-crm/
├── .github/
│   └── workflows/
│       └── ci.yml
├── client/                     # React + TypeScript SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── feedback/
│   │   │   └── layout/
│   │   ├── config/
│   │   ├── contexts/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── challans/
│   │   │   ├── crm/
│   │   │   ├── dashboard/
│   │   │   └── inventory/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── db/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .gitignore
└── README.md
Implementation Roadmap & Requirement ClarificationsPhased 48-Hour Implementation PlanImplementation PhaseTarget TimelineCore Engineering DeliverablesPhase 1: Foundations & AuthHours 00 – 08Setup Supabase database migrations, Express service layer, Zod validation, JWT generation, and login endpoints.Phase 2: CRM & InventoryHours 08 – 20Build customer CRUD endpoints, follow-up timeline tracking, product master views, and stock adjustment endpoints.Phase 3: Challan EngineHours 20 – 36Build draft challan creation, line item snapshot logic, and transaction-safe confirmation engine using SELECT FOR NO KEY UPDATE.Phase 4: Dashboard & UIHours 36 – 44Build administrative overview dashboards, low-stock warnings, responsive layouts, error boundaries, and client route guards.Phase 5: Deploy & DocumentationHours 44 – 48Deploy frontend to Vercel and backend to Render, perform live testing, export Postman collections, and finalize setup documentation.Requirement Ambiguities & Technical ResolutionsChallan Cancellation Business Logic:Ambiguity: The specification lists a CANCELLED status but does not explicitly detail stock handling for cancellations.Architectural Resolution: Cancelling a DRAFT challan simply updates its status flag with no inventory impact. Cancelling a CONFIRMED challan executes an atomic IN stock movement inside a transaction, returning the deducted items to active stock.Warehouse Location Modeling:Ambiguity: Warehouse storage is defined as a simple field attribute on products.Architectural Resolution: Modeled as a free-text location identifier (location string column) on the products table. This satisfies requirements cleanly without adding unnecessary multi-warehouse table overhead for Phase 1.Supabase Client SDK vs Backend REST Scope:Ambiguity: Mentions Supabase database hosting alongside standard Express REST API requirements.Architectural Resolution: Supabase is used strictly as a managed PostgreSQL database. The Express API backend connects via standard database connection pooling, handling custom JWT authentication and authorization rules entirely within API middleware.
