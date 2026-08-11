# 1. Project Overview

The **Mini ERP + CRM Operations Portal** is a software platform designed specifically for small-to-medium wholesale and distribution businesses. 

## The Business Problem
The platform bridges essential operational functions across sales teams, warehouse personnel, accounts departments, and executive administration. It acts as a single source of truth for operations that are typically fragmented across spreadsheets or legacy software.

## Target Audience
- Wholesale distributors
- Small-to-medium inventory-centric businesses
- Operations teams (Sales agents, Warehouse managers, Account executives)

## Core Business Workflow
The platform is designed around the following unified workflow:

1. **Customer (Lead)**: A sales agent adds a new prospective customer to the system.
2. **CRM**: The sales team logs interactions (Follow-ups) and transitions the customer to ACTIVE.
3. **Product**: Warehouse or Admin adds product catalogs, determining SKU, pricing, and initial stock via Stock Movements.
4. **Inventory**: The system tracks all inventory balances, preventing stockouts and negative quantities.
5. **Sales Challan**: Sales generates a draft order (Challan) for the customer's products.
6. **Stock Movement**: Upon confirming the challan, the system atomically deducts stock and records an immutable ledger entry.
7. **Dashboard / Operational Tracking**: Executives and operators monitor active leads, stock levels, and daily sales dispatches via a centralized dashboard.
