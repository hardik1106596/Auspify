import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data));
  }, []);

  const createCourse = async () => {
    const title = prompt("Enter course title:");
    const description = prompt("Enter course description:");

    if (!title || !description) return;

    try {
      const res = await api.post("/courses", {
        title,
        description,
        category: "General",
        level: "Beginner",
        lessons: [],
      });

      setCourses((prev) => [...prev, res.data]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create course.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>

        <button
          onClick={createCourse}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
        >
          + Create Course
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-10">Available Courses</h2>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white border p-5 rounded-xl">
            <h3 className="font-bold text-xl">{course.title}</h3>
            <p className="text-gray-500 mt-2">{course.description}</p>
            <p className="mt-4">{course.published ? "Published" : "Draft"}</p>
            <Link to={`/courses/${course._id}`} className="text-indigo-600 mt-3 block">
              View Course
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
