# Product Tour

Welcome to the Fundsroom Infotech Mini ERP + CRM Operations Portal. This tour walks you through the core user experience across all major modules of the application.

## 1. Landing Page

When unauthenticated users visit the platform, they are greeted with a clean, branded landing page that communicates the product's value proposition before directing them to log in.

![Landing Page](/assets/screenshots/landing_page_1.png)

**What you can do:**
- Read about the platform's features
- Navigate to the Sign In portal

## 2. Authentication (Login)

The gateway to the portal enforces strict Role-Based Access Control (RBAC).

![Login Page](/assets/screenshots/go_signin_page.png)

**What you can do:**
- Authenticate with an email and password
- The system automatically detects your role (ADMIN, SALES, WAREHOUSE, ACCOUNTS) and routes you to the appropriate dashboard context.

## 3. Dashboard

Upon successful login, you are routed to your context-aware dashboard.

![Admin Dashboard](/assets/screenshots/admin_dashboard.png)

**What you see:**
- High-level KPIs (Total Customers, Active Products, Low Stock Alerts)
- A sidebar navigation menu tailored strictly to your permissions. (e.g., Sales cannot see the Inventory adjustment tabs).

## 4. CRM (Customers)

The CRM module is where relationships are managed.

![Customers List](/assets/screenshots/admin_customer.png)

**What you see:**
- A searchable, paginated list of all B2B and retail clients.
- Status badges indicating if a customer is Active or Inactive.

**What you can do:**
- Add new customers.
- Click into a customer profile to log follow-up interactions (calls, meetings).

## 5. Products Catalog

The definitive master list of all sellable goods.

![Products Grid](/assets/screenshots/admin_products.png)

**What you see:**
- Grid layout of products with their current base price, SKU, category, and real-time available stock.

**What you can do (Admin):**
- Create new products and set their pricing and minimum stock thresholds.

## 6. Inventory Management

The warehouse command center for managing physical stock.

![Inventory Grid](/assets/screenshots/warehouse_stock.png)

**What you see:**
- A focused view on physical stock levels rather than pricing.

**What you can do (Warehouse/Admin):**
- Click "Adjust Stock" on any item to log a manual IN (restock) or OUT (damage/loss) adjustment, bypassing standard sales flows.

## 7. Stock Movements

The immutable ledger of all inventory changes.

![Stock Movements](/assets/screenshots/admin_stock_movements.png)

**What you see:**
- A chronological, append-only log of every time stock increased or decreased, who did it, and whether it was a manual adjustment or a sales challan deduction.

## 8. Sales Challans

The bridge between CRM and Inventory.

![Sales Challans](/assets/screenshots/sales_challans.png)

**What you see:**
- A list of draft, confirmed, and cancelled dispatch orders.

**What you can do (Sales/Admin):**
- Create a new draft challan for a customer.
- Add line items to the challan.
- **Confirm** the challan, which automatically checks stock, deducts inventory, and finalizes the order.
