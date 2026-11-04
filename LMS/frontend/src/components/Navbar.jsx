import { Link } from "react-router-dom";
import { BookOpen, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
        <BookOpen /> Learnify
      </Link>

      <div className="flex items-center gap-5">
        <Link to="/courses">Courses</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile"><User size={18} /></Link>
            <button onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
