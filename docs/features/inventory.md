<div class="page-header">
  <span class="category-badge">FEATURE / INVENTORY</span>
  <h1>Inventory Engine</h1>
  <p class="page-subtitle">Precise tracking of physical stock quantities and adjustments.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Provides an interface for tracking current stock levels, adjusting quantities (IN/OUT), and viewing warehouse allocations.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Prevents stockouts, tracks physical location of assets, and enables accurate sales by ensuring items cannot be sold if they don't exist.</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/warehouse_stock.png" alt="Inventory Engine" />
</div>
<p class="screenshot-caption">Inventory Engine — Stock management and tracking</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | Full access |
| <span class="role-badge sales">SALES</span> | Read-Only (View quantities) |
| <span class="role-badge warehouse">WAREHOUSE</span> | Full access (Adjust stock) |
| <span class="role-badge accounts">ACCOUNTS</span> | Read-Only |

## How It Works
Direct stock adjustments can be made via a Stock Adjustment Modal. These adjustments bypass standard sales challans but are still logged immutably in the stock movements ledger.

## Important Implementation Details
- Inventory quantities are strictly bound to product IDs.
- Concurrency control prevents negative stock during concurrent adjustments.
