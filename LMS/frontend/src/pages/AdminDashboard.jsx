import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          ["Total Courses", courses.length],
          ["Total Users", users.length],
          ["Platform Status", "Active"],
        ].map(([title, value]) => (
          <div key={title} className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold mt-3">{value}</h2>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
