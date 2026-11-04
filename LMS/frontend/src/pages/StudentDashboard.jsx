import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { BookOpen, Trophy, GraduationCap } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get("/enrollments/my").then((res) => setEnrollments(res.data));
    api.get("/progress/my").then((res) => setProgress(res.data));
  }, []);

  const completed = enrollments.filter((e) => e.completed).length;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Welcome back, {user?.name}!
      </h1>

      <p className="text-gray-500 mt-2">
        Continue your learning journey.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          ["Enrolled Courses", enrollments.length, BookOpen],
          ["Completed Courses", completed, Trophy],
          ["Learning Activities", progress.length, GraduationCap],
        ].map(([title, value, Icon]) => (
          <div key={title} className="bg-white border rounded-xl p-6">
            <Icon className="text-indigo-600" size={30} />
            <p className="text-gray-500 mt-4">{title}</p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12">My Courses</h2>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {enrollments.map((enrollment) => (
          <div key={enrollment._id} className="bg-white border rounded-xl p-5">
            <img
              src={enrollment.course?.thumbnail || "https://placehold.co/600x300"}
              alt=""
              className="w-full h-36 object-cover rounded-lg"
            />

            <h3 className="font-bold text-xl mt-4">
              {enrollment.course?.title}
            </h3>

            <span className="text-indigo-600">
              {enrollment.completed ? "Completed" : "In Progress"}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
