<div class="page-header">
  <span class="category-badge">FEATURE / STOCK MOVEMENTS</span>
  <h1>Stock Movements Ledger</h1>
  <p class="page-subtitle">An immutable append-only record of every change to inventory quantities across the platform.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Logs the `product_id`, `quantity` (positive or negative), `type` (ADJUSTMENT_IN, ADJUSTMENT_OUT, SALE), and the user who initiated the change.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Provides absolute auditability. If inventory levels are questioned, this ledger acts as the single source of truth.</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/admin_stock_movements.png" alt="Stock Movements Ledger" />
</div>
<p class="screenshot-caption">Stock Movements Ledger — Append-only audit trail</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | View all |
| <span class="role-badge sales">SALES</span> | No Access |
| <span class="role-badge warehouse">WAREHOUSE</span> | View all |
| <span class="role-badge accounts">ACCOUNTS</span> | No Access |

## How It Works
Whenever an inventory quantity is modified via an API route, a database trigger or explicit service method inserts a corresponding row into the `stock_movements` table within the same transaction.

## Important Implementation Details
- Entries in this table are **append-only**.
- No API endpoint exists for deleting a stock movement to prevent tampering.
