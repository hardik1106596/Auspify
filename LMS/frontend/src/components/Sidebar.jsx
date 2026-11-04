import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
} from "lucide-react";

export default function Sidebar({ role }) {
  const dashboard = role === "admin"
    ? "/admin"
    : role === "instructor"
    ? "/instructor"
    : "/dashboard";

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8 text-indigo-600">
        Learnify LMS
      </h2>

      <nav className="space-y-3">
        <NavLink to={dashboard} className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50">
          <LayoutDashboard /> Dashboard
        </NavLink>

        <NavLink to="/courses" className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50">
          <BookOpen /> Courses
        </NavLink>

        <NavLink to="/my-learning" className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50">
          <GraduationCap /> My Learning
        </NavLink>

        <NavLink to="/profile" className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50">
          <User /> Profile
        </NavLink>
      </nav>
    </aside>
  );
}
