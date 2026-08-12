# Mini ERP + CRM Operations Portal

> **[ 📖 README ](README.md) &nbsp; | &nbsp; [ 🛠️ Setup Guide ](SETUP.md) &nbsp; | &nbsp; [ 🌐 Full Documentation ](https://rahul-pamula.github.io/fundsroom_infotech/)**

---

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

**[🌐 Open Live Application](https://fundsroom-infotech-client.vercel.app/)**

**[⚙️ Open Backend API](https://fundsroom-api-u6tm.onrender.com)**

---

## 📚 Documentation

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

**[📖 Open Complete Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/)**

---

## 🖥️ Application Preview

<table>
<tr>
<td width="50%">

<img src="docs/public/assets/screenshots/landing_page_1.png" alt="Fundsroom Landing Page" width="100%">

<p align="center"><b>Landing Page</b></p>

</td>

<td width="50%">

<img src="docs/public/assets/screenshots/admin_dashboard.png" alt="Fundsroom Dashboard" width="100%">

<p align="center"><b>Dashboard</b></p>

</td>
</tr>

<tr>
<td width="50%">

<img src="docs/public/assets/screenshots/admin_customer.png" alt="Customer CRM" width="100%">

<p align="center"><b>Customer CRM</b></p>

</td>

<td width="50%">

<img src="docs/public/assets/screenshots/admin_products.png" alt="Products and Inventory" width="100%">

<p align="center"><b>Products & Inventory</b></p>

</td>
</tr>
</table>

---

## 📌 Overview

The Mini ERP + CRM Operations Portal is a full-stack business operations system designed for wholesale and distribution workflows.

It brings together:

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

The system is designed for a wholesale/distribution business where Sales, Warehouse, Accounts, and Admin users need shared operational data while maintaining role-specific access.

The case study specifically requires authentication, CRM, inventory, stock movement, and sales challan workflows.

---

## 💡 Solution

The portal provides one centralized system for:

- Customer management
- Product management
- Inventory tracking
- Stock movement auditing
- Sales challans
- CRM follow-ups
- Role-based access

---
# 🛠️ Setup Guide

Get the **Fundsroom Mini ERP + CRM Operations Portal** running on your local machine in minutes.

---

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 1. Installation

**Clone the repository:**
```bash
git clone https://github.com/Rahul-pamula/fundsroom_infotech.git
cd fundsroom_infotech
```

**Install dependencies:**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

## 2. Environment Setup

Create `.env` files in both the client and server directories. 

**Backend (`server/.env`):**
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fundsroom_db
JWT_SECRET=your_super_secret_jwt_key_change_me
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## 3. Database Setup

You can run the PostgreSQL database using either **Docker** or a **Local PostgreSQL Installation**.

### Option A: Using Docker (Recommended)
Start the local PostgreSQL database using the provided Docker Compose file:
```bash
docker-compose up -d
```

### Option B: Local PostgreSQL Installation
If you do not have Docker installed, you can use a local installation of PostgreSQL:
1. Ensure PostgreSQL is installed and running on your machine.
2. Open your `psql` terminal or pgAdmin.
3. Create a new database named `fundsroom_db`.
4. Update the `DATABASE_URL` in `server/.env` to match your local PostgreSQL credentials (e.g. `postgresql://your_user:your_password@localhost:5432/fundsroom_db`).

## 4. Migration and Seeding

Run the database migrations and seed it with initial admin users, products, and customers.

```bash
cd server
npm run db:migrate
npm run db:seed
```

## 5. Running the Application

You can now start both the backend and frontend development servers.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 6. Access the Platform
The application is now accessible at `http://localhost:5173`. 
You can log in using the seeded admin credentials:

- **Email:** `admin@fundsroom.local`
- **Password:** `Password123!`


## ✨ Key Features

| Module | Highlights |
|---|---|
| 🔐 Authentication | JWT authentication + RBAC |
| 👥 Customer CRM | Add, edit, search, details, follow-ups |
| 📦 Products | SKU, category, pricing, stock |
| 📊 Inventory | IN/OUT movements and low-stock visibility |
| 🧾 Challans | Draft, confirm, cancel, multiple products |
| 📈 Dashboard | Operational summaries and recent activity |

---

## 🛡️ Role-Based Access

| Role | Purpose |
|---|---|
| ADMIN | Full operational control |
| SALES | Customer and sales workflows |
| WAREHOUSE | Inventory and stock operations |
| ACCOUNTS | Customer, product and challan operations |

**Role authorization is enforced server-side; the login role selection is only verified against the user's actual database role.**

[View Authentication & RBAC Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/security/authentication.html)

---

## 🔑 Test Credentials

Use the following credentials to test the live application across different roles.
All accounts use the same password: **`Password123!`**

| Role | Email |
|---|---|
| **ADMIN** | `admin@fundsroom.local` |
| **SALES** | `sales@fundsroom.local` |
| **WAREHOUSE** | `warehouse@fundsroom.local` |
| **ACCOUNTS** | `accounts@fundsroom.local` |

---

## 🏗️ Architecture

[View Architecture Documentation →](https://rahul-pamula.github.io/fundsroom_infotech/system-design/architecture.html)

```text
User
 │
 ▼
React Frontend
(Vercel)
 │
 │ HTTPS / REST API
 ▼
Express Backend
(Render)
 │
 │ pg
 ▼
Supabase PostgreSQL
```


