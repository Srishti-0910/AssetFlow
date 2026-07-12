# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow helps organizations track physical assets (equipment, devices, vehicles, facilities), manage resource allocation to teams/projects, schedule maintenance, and get a real-time view of asset health — all from one dashboard.

## Why AssetFlow

Enterprises lose money on assets they can't see: idle equipment, missed maintenance windows, and no audit trail for who has what. AssetFlow gives every asset a digital tag — status, owner, location, and history — searchable and reportable in seconds.

## Features

- **Asset registry** — create, tag, and categorize assets with unique IDs, status, and location
- **Resource allocation** — assign assets to employees, teams, or projects with check-out/check-in history
- **Maintenance scheduling** — log maintenance events, set due dates, flag overdue assets automatically
- **Role-based auth** — Admin, Manager, and Staff roles with JWT-secured access
- **Live dashboard** — asset counts by status/category, upcoming maintenance, recent activity
- **Audit trail** — every allocation and status change is timestamped and attributed

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Recharts
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)
**Auth:** JWT + bcrypt

## Project Structure

```
assetflow/
├── backend/        # Express API, models, controllers, routes
└── frontend/       # React app (Vite + Tailwind)
```

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend on `http://localhost:5000`.

## Roadmap

- [x] Backend scaffold & data models
- [x] Auth (register/login, JWT, roles)
- [x] Asset CRUD API
- [x] Resource allocation & maintenance API
- [x] Frontend auth flow
- [x] Dashboard & asset management UI
- [ ] Email/notification reminders for overdue maintenance
- [ ] CSV import/export for bulk asset upload
- [ ] QR code generation per asset tag

## License

MIT
