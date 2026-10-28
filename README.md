# 🍔 QuickBite – Food Delivery System (MERN)

React + Tailwind CSS + Redux Toolkit frontend, Express + MongoDB backend, JWT auth with roles,
Socket.io real-time notifications, Docker Compose, GitHub Actions CI/CD.

```
quickbite/
├── backend/            Express API (routes, models, middleware, socket, tests)
├── frontend/           React + Vite + Tailwind app
├── docker-compose.yml  mongo + backend + frontend
├── .github/workflows/  CI/CD pipeline
└── EXPERIMENTS.md      Lab file: Experiments 1-10 (steps + code)
```

## Run it (pick one)

### A) Docker (easiest, only Docker needed)
```bash
docker compose up --build
```
Open **http://localhost:3000**

### B) Local development (Node 20+ and MongoDB running)
```bash
npm run install:all
cp backend/.env.example backend/.env
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

The menu and an admin account are seeded automatically on first start:

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@quickbite.com  | Admin@123  |

Sample data is seeded on first start: **~90 menu items in 14 categories** (veg / non-veg, ratings,
prep times), **6 demo customers** (e.g. `aarav@example.com` / `User@123`) and **40 past orders** so the
admin dashboard and "My Orders" are populated. Or register your own user from the site.

## Try the real-time feature
Open two browsers: log in as a user in one and as admin in the other. Place an order as the user
(admin sees a toast), then change its status in Admin → the user gets a live notification.

## API summary
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/foods | public |
| POST/PUT/DELETE | /api/foods | admin |
| POST | /api/orders | logged in |
| GET | /api/orders/mine | logged in |
| GET | /api/orders | admin |
| PATCH | /api/orders/:id/status | admin |
