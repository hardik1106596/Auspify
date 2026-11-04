import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Courses from './pages/Courses.jsx';
import Home from './pages/Home.jsx';
import InstructorDashboard from './pages/InstructorDashboard.jsx';
import Login from './pages/Login.jsx';
import MyLearning from './pages/MyLearning.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

function DashboardHome() {
  const { user } = useAuth();
  if (user.role === 'instructor') return <InstructorDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <StudentDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route element={<ProtectedRoute roles={['instructor', 'admin']} />}>
              <Route path="courses" element={<InstructorDashboard />} />
            </Route>
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="users" element={<AdminDashboard />} />
            </Route>
          </Route>
          <Route path="learning" element={<DashboardLayout />}><Route index element={<MyLearning />} /></Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
