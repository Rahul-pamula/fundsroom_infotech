<div class="page-header">
  <span class="category-badge">FEATURE / SALES</span>
  <h1>Sales Challans</h1>
  <p class="page-subtitle">The drafting, issuance, and fulfillment of dispatch records for customers.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Allows users to create a multi-item list of products being sold or dispatched, capturing historical pricing and deducting stock dynamically upon confirmation.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Standardizes the sales process, bridging the gap between customer relations (CRM) and physical stock (Inventory).</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/sales_challans.png" alt="Sales Challans" />
</div>
<p class="screenshot-caption">Sales Challans — Drafting and confirming orders</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | Full access |
| <span class="role-badge sales">SALES</span> | Create and Confirm Challans |
| <span class="role-badge warehouse">WAREHOUSE</span> | Read-Only (for fulfillment) |
| <span class="role-badge accounts">ACCOUNTS</span> | Read-Only (for invoicing) |

## How It Works
1. **Drafting**: A user initiates a challan and adds line items.
2. **Confirmation**: The system verifies stock availability and locks the relevant product rows in the database.
3. **Execution**: Stock is deducted, the challan status changes to `CONFIRMED`, and stock movements are logged simultaneously.

## Important Implementation Details
- Uses PostgreSQL pessimistic row-level locking (`SELECT FOR UPDATE`) within ACID transactions to ensure stock is never oversold during high concurrency.
- Pricing is snapshot-captured in `challan_items` to protect against future changes to base product prices.
