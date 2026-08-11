<div class="page-header">
  <span class="category-badge">SYSTEM DESIGN</span>
  <h1>Architecture</h1>
  <p class="page-subtitle">Understand how the Fundsroom platform connects the frontend, backend, database, authentication, and business workflows.</p>
  <hr class="header-divider" />
</div>

The application follows a monolithic backend architecture with a separately deployed frontend and backend.

## High-Level Architecture

<div class="architecture-container">
  <img src="/assets/architecture/high-level-architecture.svg" alt="High-Level System Architecture" />
</div>

<p class="screenshot-caption">Figure 1 — High-Level System Architecture</p>

### How it works
The system communicates unidirectionally via HTTP and TCP protocols. The React SPA interacts exclusively with the Express REST API via HTTPS, and the Express API communicates with the PostgreSQL database via TCP port 6543 (Supabase connection pool).

## Target Deployment Architecture

<div class="architecture-container">
  <img src="/assets/architecture/deployment-architecture.svg" alt="Target Deployment Architecture" />
</div>

<p class="screenshot-caption">Figure 2 — Target Deployment Architecture</p>

### How it works
Vercel hosts the React frontend, Railway hosts the Node.js Express backend API, Supabase hosts the PostgreSQL database, and GitHub Pages hosts this documentation. This forms our production deployment topology.

## Backend Layered Architecture

<div class="architecture-container">
  <img src="/assets/architecture/backend-layered-architecture.svg" alt="Backend Layered Architecture" />
</div>

<p class="screenshot-caption">Figure 3 — Backend Layered Architecture</p>

### How it works
The Node.js Express backend strictly isolates responsibilities passing from the HTTP layer down to the database level, following Clean Architecture principles. Incoming requests pass through middleware (auth, RBAC, zod) to controllers, which hand off business workflows to services, which utilize repositories for database access.
