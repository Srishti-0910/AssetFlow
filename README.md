# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow helps organizations track physical assets (equipment, devices, vehicles, facilities), manage resource allocation to teams/projects, schedule maintenance, and get a real-time view of asset health — all from one dashboard.

**Live demo:** _add your deployed Vercel URL here once deployed_

## Why AssetFlow

Enterprises lose money on assets they can't see: idle equipment, missed maintenance windows, and no audit trail for who has what. AssetFlow gives every asset a digital tag — status, owner, location, and history — searchable and reportable in seconds.

## Features

- **Asset registry** — create, tag, and categorize assets with unique IDs, status, and location
- **Resource allocation** — assign assets to employees, teams, or projects with check-out/check-in history
- **Maintenance scheduling** — log maintenance events, set due dates, flag overdue assets automatically
- **Role-based auth** — Admin, Manager, and Staff roles with JWT-secured access
- **Live dashboard** — asset counts by status/category, upcoming maintenance, recent activity
- **Audit trail** — every allocation and status change is timestamped and attributed
- **Polished UX** — skeleton loading states, actionable empty states, and a branded favicon across every screen

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Recharts
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)
**Auth:** JWT + bcrypt

## Project Structure

```
assetflow/
├── backend/        # Express API, models, controllers, routes
├── frontend/        # React app (Vite + Tailwind)
└── render.yaml      # Render blueprint for one-click backend deploy
```

## Getting Started (local development)

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

The frontend runs on `http://localhost:5173` and proxies API requests to the backend on `http://localhost:5000` (see `frontend/vite.config.js`). No `.env` is needed locally — leave `VITE_API_URL` unset and the proxy handles it.

### Load demo data (recommended for a quick look)

```bash
cd backend
npm run seed
```

This creates two accounts and a handful of sample assets, allocations, and maintenance records:

| Role  | Email                | Password      |
|-------|-----------------------|---------------|
| Admin | admin@assetflow.dev   | password123   |
| Staff | staff@assetflow.dev   | password123   |

## API Reference

All routes are prefixed with `/api`. Authenticated routes expect `Authorization: Bearer <token>`.

| Method | Route                          | Description                          | Access          |
|--------|---------------------------------|--------------------------------------|-----------------|
| POST   | `/auth/register`               | Create an account                     | Public          |
| POST   | `/auth/login`                  | Get a JWT                             | Public          |
| GET    | `/auth/me`                     | Current user profile                  | Authenticated   |
| GET    | `/assets`                      | List/search/filter assets             | Authenticated   |
| POST   | `/assets`                      | Create an asset                       | Admin, Manager  |
| PUT    | `/assets/:id`                  | Update an asset                       | Admin, Manager  |
| DELETE | `/assets/:id`                  | Delete an asset                       | Admin           |
| GET    | `/allocations`                 | List allocations                      | Authenticated   |
| POST   | `/allocations/check-out`       | Assign an asset to a user              | Admin, Manager  |
| POST   | `/allocations/:id/check-in`    | Return an asset                       | Admin, Manager  |
| GET    | `/maintenance`                 | List maintenance records              | Authenticated   |
| POST   | `/maintenance`                 | Schedule maintenance                  | Admin, Manager  |
| POST   | `/maintenance/:id/complete`    | Mark maintenance complete             | Admin, Manager  |
| GET    | `/dashboard/summary`           | Aggregated stats for the dashboard    | Authenticated   |
| GET    | `/health`                      | API health check (used by Render)     | Public          |

---

## Deployment: Vercel (frontend) + Render (backend)

Both are free. You'll deploy the backend first (so you have its URL), then the frontend.

### Step 0 — Push to GitHub

Make sure your latest code (including `render.yaml`, `frontend/vercel.json`, and the updated `.env.example` files) is committed and pushed to `github.com/Srishti-0910/AssetFlow`.

### Step 1 — Database: MongoDB Atlas (free tier)

You need a cloud database — `localhost` won't work once deployed.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a **free M0 cluster**
3. Under **Database Access**, add a database user with a username/password
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere — needed since Render's IP isn't static on the free tier)
5. Click **Connect** → **Drivers** → copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/assetflow?retryWrites=true&w=majority
   ```
   Replace `<username>`/`<password>` and add `/assetflow` before the `?` so it uses a database named `assetflow`.

### Step 2 — Backend on Render

1. Go to [render.com](https://render.com) → sign up/log in with GitHub
2. Click **New +** → **Web Service**
3. Select the **AssetFlow** repo
4. Render should detect `render.yaml` automatically and pre-fill the settings below. If not, set them manually:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Set environment variables:
   - `MONGO_URI` → your Atlas connection string from Step 1
   - `JWT_SECRET` → any long random string (Render can auto-generate this if using the blueprint)
   - `JWT_EXPIRES_IN` → `7d`
   - `CLIENT_ORIGIN` → leave as `http://localhost:5173` for now; you'll update this after Step 3 with your real Vercel URL
6. Click **Create Web Service** and wait for the build to finish
7. Copy your live backend URL, e.g. `https://assetflow-backend.onrender.com`
8. Verify it's up: visit `https://assetflow-backend.onrender.com/api/health` — you should see `{"status":"ok","service":"AssetFlow API"}`

> **Free tier note:** Render's free web services spin down after ~15 minutes of inactivity. The first request after idling can take 30–60 seconds while it wakes up — this is normal, not a bug.

### Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up/log in with GitHub
2. Click **Add New...** → **Project** → import the **AssetFlow** repo
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (Vercel auto-detects this)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. Add an environment variable:
   - `VITE_API_URL` → `https://assetflow-backend.onrender.com/api` (your Render URL from Step 2, with `/api` at the end)
5. Click **Deploy**
6. Once live, copy your Vercel URL, e.g. `https://assetflow.vercel.app`

### Step 4 — Connect the two

Go back to Render → your backend service → **Environment**, and update:
- `CLIENT_ORIGIN` → `https://assetflow.vercel.app` (your real Vercel URL — add any Vercel preview URLs too, comma-separated, if you want preview deploys to work)

Save, which triggers a redeploy. Once it's back up, your app is live end to end.

### Step 5 — Seed demo data on the deployed DB (optional)

Run the seed script locally, pointed at your Atlas cluster:
```bash
cd backend
MONGO_URI="<your Atlas connection string>" npm run seed
```

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend loads but API calls fail with a network error | `VITE_API_URL` missing/wrong on Vercel, or `CLIENT_ORIGIN` on Render doesn't match your Vercel URL exactly (including `https://`, no trailing slash) |
| "CORS blocked" error in browser console | `CLIENT_ORIGIN` on Render doesn't include your Vercel URL |
| Refreshing `/assets` or `/allocations` on Vercel gives a 404 | Make sure `frontend/vercel.json` exists and was deployed (it rewrites all routes to `index.html`) |
| Backend takes ~30s to respond on first load | Normal — Render's free tier sleeps after inactivity |
| `MongoServerError: bad auth` | Double-check the Atlas username/password in `MONGO_URI`, and that the user has read/write access |

---

## Roadmap

- [x] Backend scaffold & data models
- [x] Auth (register/login, JWT, roles)
- [x] Asset CRUD API
- [x] Resource allocation & maintenance API
- [x] Frontend auth flow
- [x] Dashboard & asset management UI
- [x] Loading/empty states, favicon, and deploy configs (Vercel + Render)
- [ ] Email/notification reminders for overdue maintenance
- [ ] CSV import/export for bulk asset upload
- [ ] QR code generation per asset tag

## License

MIT
