<div class="page-header">
  <span class="category-badge">AUTHENTICATION & SECURITY</span>
  <h1>Role-Based Access Control</h1>
  <p class="page-subtitle">Stateless JWT authentication enforcing strict operational boundaries across Admin, Sales, Warehouse, and Accounts workflows.</p>
  <hr class="header-divider" />
</div>

The system employs custom stateless JSON Web Tokens (JWT) for authentication, avoiding heavy dependencies on external identity providers while maintaining strict security control.

## Authentication Flow

<div class="architecture-container">
  <img src="/assets/architecture/authentication-flow.svg" alt="Authentication Architecture Flow" />
</div>
<p class="screenshot-caption">Figure 4 — Authentication & Login Flow</p>

1. User POSTs email/password/selected role to `/api/v1/auth/login`.
2. Backend queries user, hashes password via `bcrypt`, and compares.
3. Backend strictly matches the selected role against the authoritative role in the database.
4. If successful, backend signs a JWT (expiring in 12 hours) containing `userId` and `role`.
5. Client stores JWT and attaches it as `Authorization: Bearer <token>` on all subsequent requests to access protected routes.

## RBAC Architecture

<div class="architecture-container">
  <img src="/assets/architecture/rbac-architecture.svg" alt="RBAC Architecture Flow" />
</div>
<p class="screenshot-caption">Figure 5 — RBAC Authoritative Database Role Enforcement</p>

The backend enforces access via `authorize(['ROLE'])` middleware, ensuring that the database remains the source of truth, regardless of the role selected by the user on the frontend. 

## Role Overview

<div class="feature-grid">
  <div class="content-card">
    <h3><span class="role-badge admin">ADMIN</span></h3>
    <p>Full operational control. Can view all modules, manage users, and view cross-functional data.</p>
  </div>
  <div class="content-card">
    <h3><span class="role-badge sales">SALES</span></h3>
    <p>Customer and sales workflows. Can generate sales challans, but cannot modify inventory directly.</p>
  </div>
  <div class="content-card">
    <h3><span class="role-badge warehouse">WAREHOUSE</span></h3>
    <p>Inventory and stock operations. Manages product catalog and stock adjustments. Cannot manage CRM.</p>
  </div>
  <div class="content-card">
    <h3><span class="role-badge accounts">ACCOUNTS</span></h3>
    <p>Account-related workflows. Read-only verification access to Challans, Customers, and Products for auditing.</p>
  </div>
</div>

## Permission Matrix

<div class="architecture-container">
  <img src="/assets/architecture/role-permission-matrix.svg" alt="Role Permission Matrix" />
</div>
<p class="screenshot-caption">Figure 6 — Functional Permissions per Role</p>

::: info SEED DATA
The system comes seeded with default users for each of the four roles for testing purposes. Dynamic user creation is currently unsupported in the UI to maintain assignment scope.
:::

## Visual Reference

<div class="screenshot-grid">
  <div class="premium-screenshot">
    <div class="premium-screenshot-bar">
      <div class="browser-dot dot-red"></div>
      <div class="browser-dot dot-yellow"></div>
      <div class="browser-dot dot-green"></div>
    </div>
    <img src="/assets/screenshots/go_signin_page.png" alt="Login Screen" />
  </div>
  <div class="premium-screenshot">
    <div class="premium-screenshot-bar">
      <div class="browser-dot dot-red"></div>
      <div class="browser-dot dot-yellow"></div>
      <div class="browser-dot dot-green"></div>
    </div>
    <img src="/assets/screenshots/rbac_signin.png" alt="RBAC Credentials Hint" />
  </div>
</div>
