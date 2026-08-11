# Mini ERP + CRM Operations Portal

A production-style ERP + CRM operations platform built for Fundsroom Infotech to manage customers, products, inventory, stock movements, sales challans, and role-based operations.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)

## 🚀 Live Demo

Frontend:  
[🌐 Open Fundsroom Application](https://fundsroom-infotech-client.vercel.app/)

Backend:  
[⚙️ Open Backend API](https://fundsroom-api-u6tm.onrender.com)

## 📚 Full Documentation

The complete project documentation covers:

- Requirements
- SDLC
- System Design
- Architecture
- Authentication & RBAC
- Database Design
- Backend API
- Frontend
- Features
- Testing
- Deployment
- User Guide
- Screenshots
- Limitations & Future Scope

[📖 Read the Full Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/)

## 🖥️ Product Preview

<p align="center">
  <img src="docs/public/assets/screenshots/landing_page_1.png" alt="Fundsroom Mini ERP + CRM Operations Portal" width="900">
</p>

## 📌 Overview

Fundsroom Infotech's Mini ERP + CRM Operations Portal is a full-stack business operations system designed for wholesale/distribution workflows. 

It brings together:
- Customer CRM
- Product management
- Inventory
- Stock movements
- Sales challans
- Authentication
- RBAC

## 🎯 Problem

Businesses need different teams such as:
- Sales
- Warehouse
- Accounts
- Administration

to work with shared customer, product, inventory, and sales information while maintaining role-specific access.

## 💡 Solution

The portal provides a centralized operations system with:
- JWT authentication
- Role-based access control
- CRM workflows
- Inventory management
- Transaction-safe stock operations
- Sales challan workflows
- PostgreSQL persistence

## ✨ Key Features

### 🔐 Authentication & RBAC
JWT authentication with roles for: `ADMIN`, `SALES`, `WAREHOUSE`, and `ACCOUNTS`.

### 👥 Customer CRM
Customer management, search, details, and follow-ups.

### 📦 Products & Inventory
Product catalog, stock levels, low-stock visibility, and stock adjustments.

### 📊 Stock Ledger
Auditable IN / OUT stock movement history.

### 🧾 Sales Challans
Draft, confirm, and cancel workflows with transaction-safe stock deduction.

### 📈 Dashboard
Operational summaries, customer statistics, inventory visibility, and recent activity.

## 📸 Application Preview

<p align="center">
  <img src="docs/public/assets/screenshots/admin_dashboard.png" alt="Dashboard" width="400">
  <img src="docs/public/assets/screenshots/admin_customer.png" alt="Customer CRM" width="400">
  <img src="docs/public/assets/screenshots/admin_products.png" alt="Products Inventory" width="400">
  <img src="docs/public/assets/screenshots/admin_challans.png" alt="Challans" width="400">
  <img src="docs/public/assets/screenshots/rbac_signin.png" alt="Login & RBAC" width="400">
</p>

## 🛡️ Role-Based Access

| Role | Purpose |
|---|---|
| ADMIN | Full operational control |
| SALES | Customer and sales workflows |
| WAREHOUSE | Inventory and stock operations |
| ACCOUNTS | Customer, product and challan access |

[View Authentication & RBAC Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/)

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │    Vercel       │
                    └────────┬────────┘
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │ Express Backend │
                    │     Render      │
                    └────────┬────────┘
                             │ pg
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Supabase     │
                    └─────────────────┘
```
