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

- **Email:** `admin@fundsroom.com`
- **Password:** `admin123`
