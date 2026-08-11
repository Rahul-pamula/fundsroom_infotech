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

---

## 🚀 Live Demo

<p align="center">

**[🌐 Open Live Application](https://fundsroom-infotech-client.vercel.app/)**

**[⚙️ Open Backend API](https://fundsroom-api-u6tm.onrender.com)**

</p>

---

## 📚 Complete Documentation

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

<p align="center">

### [📖 Open Fundsroom Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/)

</p>

---

## 🖥️ Product Preview

<p align="center">
  <img
    src="docs/public/assets/screenshots/landing_page_1.png"
    alt="Fundsroom Mini ERP + CRM Operations Portal landing page"
    width="950"
  />
</p>

---

## 📸 Application Preview

### Dashboard

<p align="center">
  <img src="docs/public/assets/screenshots/admin_dashboard.png" alt="ERP dashboard" width="900" />
</p>

### Customer CRM

<p align="center">
  <img src="docs/public/assets/screenshots/admin_customer.png" alt="Customer CRM" width="900" />
</p>

### Products & Inventory

<p align="center">
  <img src="docs/public/assets/screenshots/admin_products.png" alt="Products and inventory" width="900" />
</p>

### Sales Challans

<p align="center">
  <img src="docs/public/assets/screenshots/admin_challans.png" alt="Sales challans" width="900" />
</p>

### Authentication & RBAC

<p align="center">
  <img src="docs/public/assets/screenshots/rbac_signin.png" alt="Authentication and role based access" width="900" />
</p>

---

## 📌 Overview

The Mini ERP + CRM Operations Portal is a full-stack business operations platform designed for wholesale and distribution workflows.

It centralizes:

- Customer CRM
- Products
- Inventory
- Stock movements
- Sales challans
- Follow-ups
- Authentication
- Role-based access control

---

## 🎯 Problem

Wholesale and distribution operations require multiple teams to work with shared business information while maintaining role-specific access.

The system needs to coordinate:

- Customers
- Sales workflows
- Products
- Warehouse stock
- Stock movements
- Challans
- Accounts operations

without giving every user unrestricted access.

---

## 💡 Solution

The portal provides a centralized operations platform with:

- JWT authentication
- Role-based access control
- Customer CRM workflows
- Product management
- Inventory management
- Stock movement tracking
- Sales challan workflows
- PostgreSQL persistence
- Transaction-safe stock operations

---

## ✨ Key Features

### 🔐 Authentication & RBAC

JWT-based authentication with:

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

### 👥 Customer CRM

- Customer management
- Search
- Customer details
- Follow-up tracking
- Customer status management

### 📦 Products & Inventory

- Product catalog
- SKU management
- Categories
- Pricing
- Stock levels
- Low-stock visibility
- Stock adjustments

### 📊 Stock Ledger

- IN / OUT movements
- Audit history
- User tracking
- Timestamps

### 🧾 Sales Challans

- Draft challans
- Multiple product items
- Quantity management
- Confirmation
- Cancellation
- Product snapshots
- Transaction-safe stock deduction

### 📈 Dashboard

- Customer summaries
- Product summaries
- Low-stock visibility
- Stock activity
- Challan activity

---

## 🛡️ Role-Based Access

| Role | Purpose |
|---|---|
| ADMIN | Full operational control |
| SALES | Customer and sales workflows |
| WAREHOUSE | Inventory and stock operations |
| ACCOUNTS | Customer, product and challan operations |

[View Complete Authentication & RBAC Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/)

---

## 🏗️ Architecture

```text
                         USER
                          │
                          ▼
                 ┌─────────────────┐
                 │ React Frontend  │
                 │     Vercel      │
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
                 │ PostgreSQL DB   │
                 │    Supabase     │
                 └─────────────────┘
```
