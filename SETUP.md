# 🛠️ Setup Guide

Get the **Fundsroom Mini ERP + CRM Operations Portal** running on your local machine.

---

## Prerequisites

Ensure you have:
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 1. Installation

```bash
git clone https://github.com/Rahul-pamula/fundsroom_infotech.git
cd fundsroom_infotech
```

Install dependencies:

```bash
cd client
npm install

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
JWT_SECRET=<generate-a-long-random-secret>
JWT_EXPIRES_IN=12h
SEED_PASSWORD=<choose-a-local-development-password>
```

Never commit real secrets or development passwords to Git.

**Frontend (`client/.env`):**

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## 3. Database Setup

### Option A: Docker (Recommended)

```bash
docker-compose up -d
```

### Option B: Local PostgreSQL

1. Ensure PostgreSQL is installed and running.
2. Create a database named `fundsroom_db`.
3. Update `DATABASE_URL` in `server/.env` with your local credentials.

## 4. Migration and Seeding

From the `server` directory, use the scripts defined in `server/package.json`:

```bash
cd server
npm run migrate
npm run seed
```

The seed script requires `SEED_PASSWORD`. It is used only to create local seeded users and is not stored in source control.

## 5. Running the Application

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

## 6. Access the Platform

Open `http://localhost:5173`.

The seeded accounts use the email addresses below. Their password is the private value you supplied as `SEED_PASSWORD`:

- `admin@fundsroom.local`
- `sales@fundsroom.local`
- `warehouse@fundsroom.local`
- `accounts@fundsroom.local`

Do not publish the seed password in documentation, source code, screenshots, or issue reports.
