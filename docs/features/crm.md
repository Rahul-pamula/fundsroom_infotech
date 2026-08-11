<div class="page-header">
  <span class="category-badge">FEATURE / CRM</span>
  <h1>Customer Relationship Management</h1>
  <p class="page-subtitle">A comprehensive view of all business-to-business (B2B) clients and retail customers interacting with the company.</p>
  <hr class="header-divider" />
</div>

<div class="feature-grid">
  <div class="content-card">
    <h3>What It Does</h3>
    <p>Allows authorized personnel to create profiles, track company details (like GST numbers and addresses), and log follow-up interactions on a timeline.</p>
  </div>
  <div class="content-card">
    <h3>Why It Exists</h3>
    <p>Centralizes customer data to prevent scattered records across spreadsheets and enables tracking relationship history.</p>
  </div>
</div>

## Interface Preview

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/admin_customer.png" alt="CRM Customers List" />
</div>
<p class="screenshot-caption">CRM Customers List — Manage accounts and interactions</p>

## Role Access

| Role | Access Level |
|---|---|
| <span class="role-badge admin">ADMIN</span> | Full access (Create, Read, Update) |
| <span class="role-badge sales">SALES</span> | Full access (Create, Read, Update) |
| <span class="role-badge warehouse">WAREHOUSE</span> | **No Access** |
| <span class="role-badge accounts">ACCOUNTS</span> | Read-Only |

## How It Works
- **List View**: A data table supporting client-side and server-side filtering, searching, and pagination.
- **Detail View**: Displays comprehensive customer information alongside a chronological timeline of interactions.
- **Interactions**: Users can log calls, meetings, or notes as "follow-ups" directly attached to the customer profile.

## Important Implementation Details
- Uses a `customer_followups` table mapped to the `customers` table with a foreign key constraint.
- Search indexes on `name` and `company_name` optimize performance for large datasets.
