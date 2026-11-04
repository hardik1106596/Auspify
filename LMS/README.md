# Auspify Learning Management System

A full-stack learning platform starter with separate React/Vite and Express/MongoDB applications.

## Requirements

- Node.js 20+
- MongoDB Community Server or a MongoDB Atlas connection string

## Configure the backend

```powershell
cd backend
npm install
copy .env.example .env
```

Set `MONGODB_URI` and a long random `JWT_SECRET` in `backend/.env`. Do not commit `.env`.

## Run locally

Start the API in one terminal:

```powershell
cd backend
npm run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`.

## Included functionality

- Learner and instructor registration, login, and authenticated profiles
- Public course catalog and course detail pages
- Instructor course creation and management
- Learner enrollment, lesson progress, quizzes, and assignment submissions
- Separate dashboards for learners, instructors, and administrators

Admin registration is disabled. Assign the `admin` role directly to a trusted user in MongoDB for local development. This starter does not include payment processing, media hosting, or production-ready admin provisioning.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/courses`, `GET /api/courses/:id`, `POST /api/courses`, `PUT /api/courses/:id`
- `POST /api/enrollments/:courseId`, `GET /api/enrollments/mine`
- `GET` and `POST /api/quizzes/course/:courseId`, `POST /api/quizzes/:id/submit`
- `GET` and `PUT /api/progress/:courseId`
- `GET` and `POST /api/assignments/course/:courseId`, `POST /api/assignments/:id/submit`

Authenticated endpoints require `Authorization: Bearer <token>`. Instructor and administrator actions are role-protected.
