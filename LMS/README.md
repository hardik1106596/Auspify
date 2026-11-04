# Learnify – Learning Management System (LMS)

A full-stack Learning Management System built using the MERN stack that provides an online platform for students and instructors to manage courses, learning materials, quizzes, assignments, and academic progress.

## 🚀 Project Overview

Learnify is designed to simplify online learning by providing students with a centralized learning platform and instructors with tools to manage educational content.

The platform supports role-based access for Students, Instructors, and Administrators.

## ✨ Features

### 👨‍🎓 Student Features
- User registration and login
- Browse available courses
- Enroll in courses
- Access enrolled courses and learning materials
- Attempt quizzes and view results
- Submit assignments
- Track learning progress
- View quiz scores and assignment grades
- Manage personal profile

### 👨‍🏫 Instructor Features
- Instructor authentication
- Create, update, and delete courses
- Manage course lessons and learning materials
- Create and manage quizzes
- Add quiz questions and answers
- Set quiz duration and passing marks
- Create and manage assignments
- View enrolled students
- Review assignment submissions
- Grade assignments
- Monitor student progress

### 🛡️ Admin Features
- Admin dashboard
- Manage students and instructors
- Manage courses
- Monitor platform activity

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose
- MongoDB Compass

### Authentication & Security
- JSON Web Token (JWT)
- bcryptjs
- Role-Based Access Control (RBAC)

## 📂 Project Structure

```text
LMS/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Learnify-LMS.git
cd LMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms_db
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

http://localhost:5000

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173

## 🗄️ Database Configuration

Learnify uses MongoDB for storing application data.

Database name:

```text
lms_db
```

Collections:

| Collection | Description |
|---|---|
| users | Student, instructor, and admin accounts |
| courses | Course information and lessons |
| enrollments | Student course enrollments |
| quizzes | Quiz questions and configurations |
| assignments | Assignment details |
| assignmentsubmissions | Student assignment submissions |
| progresses | Student learning progress |

MongoDB Compass can be used to inspect and manage database collections.

## 👤 User Roles

| Role | Access |
|---|---|
| Student | Courses, quizzes, assignments, learning progress |
| Instructor | Course management, quizzes, assignments, grading |
| Admin | Platform and user management |

## 🔐 Demo Instructor Account

```text
Email: instructor@learnify.com
Password: Demo123456
```

The instructor account must exist in the database with a properly hashed password and the `instructor` role.

## 📚 Learning Management Modules

### Course Management
Instructors can create and manage courses, lessons, and learning materials.

### Quiz Management
Instructors can create quizzes and questions. Students can attempt quizzes and view their scores.

### Assignment Management
Instructors can create assignments, set deadlines, and evaluate submissions.

### Progress Tracking
Students can monitor their course completion and learning progress.

## 🔗 API Modules

| Module | Description |
|---|---|
| `/api/auth` | Registration, login, authentication |
| `/api/courses` | Course management |
| `/api/enrollments` | Course enrollment |
| `/api/quizzes` | Quiz management and attempts |
| `/api/assignments` | Assignment management and submissions |
| `/api/progress` | Learning progress tracking |

## ▶️ Running the Application

Start MongoDB locally.

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

http://localhost:5173

## 🎯 Project Objective

The objective of Learnify is to provide an interactive and user-friendly learning environment where students can learn online, complete assessments, and track their academic progress while instructors manage courses and evaluate student performance.

## 👨‍💻 Developer

**Hardik Sagadhara**

Full Stack Development Intern

A MERN Stack Learning Management System developed as part of practical full-stack development training.

---

⭐ If you find this project useful, consider giving it a star on GitHub.
