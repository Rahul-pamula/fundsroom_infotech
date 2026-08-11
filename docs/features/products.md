<div class="page-header">
  <span class="category-badge">FEATURE / PRODUCTS</span>
  <h1>Products Catalog</h1>
  <p class="page-subtitle">The core definitions and authoritative catalog of all goods the company handles.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Maintains a definitive list of active products, base pricing, SKU definitions, and categorization.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Serves as the foundation for both the inventory engine and sales challans, ensuring consistent data across the entire platform.</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/admin_products.png" alt="Products Catalog" />
</div>
<p class="screenshot-caption">Products Catalog — Master product listing</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | Full access (Create, Edit) |
| <span class="role-badge sales">SALES</span> | Read-Only |
| <span class="role-badge warehouse">WAREHOUSE</span> | Read-Only (Stock adjustment is handled in Inventory) |
| <span class="role-badge accounts">ACCOUNTS</span> | Read-Only |

## How It Works
Provides a grid and list view of products with dynamic filtering capabilities by category or status.

## Important Implementation Details
- Products are never hard-deleted; they are marked `active: false` to preserve historical integrity on older challans.
