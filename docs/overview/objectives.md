# 3. Objectives

The primary goal of this project is to provide a unified, transactionally safe, and role-gated platform for wholesale operations. 

The specific objectives achieved are:

- **Centralized CRM**: Provide a single directory for Lead/Active/Inactive customers and a historical log of all follow-up interactions.
- **Inventory Management**: Maintain a central product catalog with real-time stock balances and low-stock threshold alerts.
- **Stock Movement Tracking**: Implement an immutable stock ledger where every inventory change is logged with a direction (IN/OUT), reason, and operator ID.
- **Sales Challan Workflow**: Enable sales teams to draft multi-item challans and capture static product snapshots to preserve historical pricing/names.
- **Transaction Safety**: Guarantee atomic stock deductions utilizing PostgreSQL pessimistic row-level locking (`SELECT FOR NO KEY UPDATE`) to prevent negative stock under concurrent loads.
- **Role-Based Access Control (RBAC)**: Secure routes and API methods strictly across ADMIN, SALES, WAREHOUSE, and ACCOUNTS roles.
- **Secure Authentication**: Provide stateless, JWT-driven custom authentication avoiding external auth-provider locks.
- **PostgreSQL Database**: Use a strictly relational 3NF database schema backed by Supabase.
- **REST API**: Develop a decoupled, robust Node.js + Express backend service validating all input with Zod.
- **Responsive Frontend**: Deliver a fast, modern React + TypeScript single-page application (SPA).
- **Production Deployment**: Ensure the system is fully prepared for cloud deployment (Vercel + Render/Railway).
