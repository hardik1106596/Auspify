import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 min-w-0 p-8 bg-slate-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
