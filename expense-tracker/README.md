# Pennywise — Expense Tracker

A classic, responsive full-stack expense tracker built with React, plain CSS, Express, MongoDB, and JWT authentication.

## Features

- Responsive dashboard with balance, income, expense, monthly chart, and category breakdown
- Add, edit, delete, search, and filter transactions
- Registration and login with hashed passwords
- JWT-protected transaction API; each user only accesses their own records
- Reports and category summaries
- Demo mode with sample transactions when not signed in

## Requirements

- Node.js 20+ recommended
- MongoDB Community Server locally, or a MongoDB Atlas connection string

## Run the frontend

From the project root:

```bash
npm install
npm run dev
```

Vite normally runs at `http://localhost:5173`.

## Run the backend

Open another terminal:

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env`, then edit it:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pennywise
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Use a long, random JWT secret. Do not commit `.env` files. Start MongoDB, then run:

```bash
npm run dev
```

The health endpoint is `http://localhost:5000/api/health`.

## Frontend API URL

The default API URL is `http://localhost:5000/api`. To override it, copy `.env.example` to `.env` in the project root and set `VITE_API_URL`.

Restart Vite after changing environment variables.

## Demo mode

The dashboard initially displays sample data. In demo mode, additions and edits exist only in React state and are not persisted after refresh. Register or sign in after the backend is running to use MongoDB persistence.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/transactions` (Bearer token required)
- `POST /api/transactions` (Bearer token required)
- `PUT /api/transactions/:id` (Bearer token required)
- `DELETE /api/transactions/:id` (Bearer token required)

## Notes before production

This is a learning project starter, not a production financial service. Before production, add automated tests, rate limiting, security headers, stricter date validation, refresh/session strategy, audit logging, and deployment-specific CORS settings. Consider an HttpOnly cookie-based session instead of storing JWTs in localStorage for a stronger browser security posture.
