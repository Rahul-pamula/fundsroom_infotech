<div class="page-header">
  <span class="category-badge">FEATURE / DASHBOARD</span>
  <h1>Operations Dashboard</h1>
  <p class="page-subtitle">The central hub of the operations portal, providing live metrics and critical alerts relevant to the logged-in user's role.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Provides an at-a-glance summary of system health, active customer counts, inventory status, and pending challans.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Users need a quick way to assess the current state of operations without manually checking individual tables.</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/admin_dashboard.png" alt="Admin Dashboard" />
</div>
<p class="screenshot-caption">Admin Dashboard — High level system metrics</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | Full view of all system metrics |
| <span class="role-badge sales">SALES</span> | Views customer metrics and personal sales metrics |
| <span class="role-badge warehouse">WAREHOUSE</span> | Views inventory metrics and low-stock alerts |
| <span class="role-badge accounts">ACCOUNTS</span> | Views financial-related overview metrics |

## How It Works
When a user logs in, the dashboard component fetches aggregate metrics from the `/api/dashboard/stats` endpoint. The data returned is filtered contextually based on the user's role.

## Important Implementation Details
- The dashboard polls data efficiently and uses **TanStack Query** for caching and background updates.
- Low-stock notifications are dynamically calculated by comparing current stock against defined minimum thresholds.
