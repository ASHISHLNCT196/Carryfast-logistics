# Carryfast Logistics — Vehicle Tracking & Operations Management System

Full-stack scaffold implementing the architecture from the Carryfast Logistics TPM project plan:

- **Backend:** Node.js 20 + Express + Sequelize (MySQL)
- **Frontend:** React 18 (Vite) + Recharts + Axios
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing, role-based access (Admin / User)
- **ANPR:** Mock recognition service (swap for the real Plate Recognizer API in production)

## Project Structure

```
carryfast-logistics/
├── backend/                 Node/Express API + MySQL (Sequelize)
│   ├── src/
│   │   ├── config/          DB connection
│   │   ├── models/          Sequelize models (Vehicle, Entry, Exit, Dock, Depot, ...)
│   │   ├── controllers/     Route handlers / business logic
│   │   ├── routes/          Express routers
│   │   ├── middleware/      JWT auth, role guard, error handler
│   │   ├── services/        Mock ANPR service
│   │   ├── seeders/         Seed script (admin user, depots, docks)
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/                 React dashboard (Vite)
│   ├── src/
│   │   ├── api/              Axios client with JWT interceptor
│   │   ├── context/          Auth context
│   │   ├── components/       Navbar, ProtectedRoute
│   │   ├── pages/             Login, Dashboard, Vehicles, EntryExit, DockBoard
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml         MySQL + backend + frontend
└── README.md
```

## Quick Start (Docker)

```bash
docker compose up --build
```

- Backend API: http://localhost:5000
- Frontend: http://localhost:5173
- MySQL: localhost:3306 (db: carryfast, user: root, password: rootpass)

Default admin login after seeding: **admin@carryfast.com / Admin@123**

## Quick Start (Manual)

### 1. Database
Create a MySQL database and copy `.env.example` to `.env` in `backend/` with your credentials.

### 2. Backend
```bash
cd backend
npm install
npm run seed      # creates tables + admin user + sample depots/docks
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

## API Overview

| Method | Endpoint                              | Description                        | Auth        |
|--------|----------------------------------------|-------------------------------------|-------------|
| POST   | /api/v1/auth/login                     | Login, returns JWT tokens           | Public      |
| POST   | /api/v1/auth/refresh                   | Refresh access token                | Public      |
| GET    | /api/v1/vehicles                       | List vehicles (paginated)           | Admin/User  |
| POST   | /api/v1/vehicles                       | Register a vehicle                  | Admin       |
| PUT    | /api/v1/vehicles/:id                   | Update a vehicle                    | Admin       |
| DELETE | /api/v1/vehicles/:id                   | Deactivate a vehicle                | Admin       |
| POST   | /api/v1/anpr/recognize                 | Mock ANPR plate recognition         | System      |
| POST   | /api/v1/entry                          | Record vehicle entry                | Admin/User  |
| POST   | /api/v1/entry/:id/assign-depot         | Assign depot + order to entry       | Admin/User  |
| POST   | /api/v1/entry/:id/assign-dock          | Assign a dock                       | Admin/User  |
| PUT    | /api/v1/loading/:id/start              | Mark loading start                  | Admin/User  |
| PUT    | /api/v1/loading/:id/complete           | Mark loading complete               | Admin/User  |
| POST   | /api/v1/exit                           | Record vehicle exit                 | Admin/User  |
| GET    | /api/v1/depots                         | List depots                         | Admin/User  |
| GET    | /api/v1/docks                          | List docks with live status         | Admin/User  |
| GET    | /api/v1/dashboard/kpis                 | Real-time KPI metrics               | Admin/User  |
| GET    | /api/v1/reports/daily                  | Daily operations report             | Admin       |

## Notes

This is a scaffold meant to demonstrate the architecture end-to-end (auth, CRUD, entry/exit workflow with the "no exit without entry" rule, dock assignment, live KPIs) — not a production deployment. Before going to production, see Part 2/Part 7 of the project execution plan (hardening, AWS hosting, real ANPR integration, monitoring).
