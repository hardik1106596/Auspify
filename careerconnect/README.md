# CareerConnect — MERN Job Portal

A clean, distinctive job portal starter for job seekers, employers and administrators.

## Stack
- React + Vite + React Router
- Custom responsive CSS (no template UI)
- Node.js + Express
- MongoDB + Mongoose (inspect data in MongoDB Compass)
- JWT authentication + bcrypt password hashing

## Requirements
- Node.js 20+
- MongoDB Community Server running locally OR a MongoDB Atlas URI
- MongoDB Compass (optional GUI)

## 1. Install

Open two terminals from the project root.

### Backend
```bash
cd server
npm install
copy .env.example .env
```
On macOS/Linux use `cp .env.example .env`.

Edit `server/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

### Frontend
```bash
cd client
npm install
```

## 2. Run

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

Open the Vite URL (normally http://localhost:5173).

## 3. MongoDB Compass

For local MongoDB, connect Compass to:
`mongodb://127.0.0.1:27017`

The application creates the `careerconnect` database and collections when the first documents are written:
- `users`
- `jobs`
- `applications`

Set `MONGO_URI=mongodb://127.0.0.1:27017/careerconnect` in `server/.env`.

For Atlas, paste your Atlas connection string into `MONGO_URI` and use the same URI in Compass.

## 4. Seed sample jobs

After starting the backend once, run:
```bash
cd server
npm run seed
```

This inserts sample jobs. It does not create a default admin account.

## 5. Roles and workflows

- Register as `seeker` to browse and apply for jobs.
- Register as `employer` to create and manage job posts.
- Admin role is intentionally not publicly selectable. Create an admin manually in MongoDB only for a trusted local development environment, or add a protected admin provisioning flow before production.

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Employer |
| PATCH | `/api/jobs/:id` | Owner employer |
| DELETE | `/api/jobs/:id` | Owner employer |
| POST | `/api/applications/:jobId` | Seeker |
| GET | `/api/applications/mine` | Seeker |
| GET | `/api/applications/received` | Employer |
| PATCH | `/api/applications/:id/status` | Employer |

## Important before deployment
This is a learning/MVP foundation, not a production-hardened hiring platform. Add email verification, password reset, rate limiting, request validation, file storage for resumes, audit logs, moderation, stronger admin provisioning, security headers, and tests before public launch. Never commit `.env`.
