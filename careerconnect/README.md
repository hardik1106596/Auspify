# CareerConnect – MERN Job Portal

Job seekers browse and apply; employers post jobs and manage applicants.

**Stack:** React + Vite + React Router, custom CSS, Node.js + Express 5, MongoDB + Mongoose, JWT auth, password hashing with bcryptjs.
**Requires:** Node.js 20+, MongoDB Community Server (local) or a MongoDB Atlas URI. MongoDB Compass is optional.

## 1. Install
```bash
cd server && npm install && cp .env.example .env     # Windows: copy .env.example .env
cd ../client && npm install
```
Edit `server/.env`: set `MONGO_URI` and a long random `JWT_SECRET`.
(Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)

## 2. Run (two terminals)
```bash
cd server && npm run dev     # API on http://localhost:5000
cd client && npm run dev     # App on http://localhost:5173
```

## 3. Compass
Connect to `mongodb://127.0.0.1:27017`. The `careerconnect` database with `users`, `jobs` and `applications` is created on first write.

## 4. Seed sample jobs
```bash
cd server && npm run seed
```
Creates a sample employer (random password, cannot log in) and 6 jobs. No admin account is created.

## 5. Roles
- `seeker`: browse and apply. `employer`: post/close/delete jobs, review applicants and set status.
- `admin` is not selectable at signup. Create one manually in MongoDB for local development only.

## API
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/jobs` (`q`, `location`, `type`, `page`) | Public |
| GET | `/api/jobs/mine` | Employer |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Employer |
| PATCH / DELETE | `/api/jobs/:id` | Owner employer |
| POST | `/api/applications/:jobId` | Seeker |
| GET | `/api/applications/mine` | Seeker |
| GET | `/api/applications/received` | Employer |
| PATCH | `/api/applications/:id/status` | Employer (owner of job) |

## Production
Build the client with `npm run build` and host `client/dist`; set `VITE_API_URL` and `CLIENT_URL`. This is an MVP foundation: add email verification, password reset, rate limiting, schema validation, resume storage, audit logs, moderation, admin provisioning and tests before public launch. Never commit `.env`.
