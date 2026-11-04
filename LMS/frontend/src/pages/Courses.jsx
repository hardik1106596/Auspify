import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CourseCard from "../components/CourseCard";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category)),
  ];

  const filtered = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold">Explore Courses</h1>
        <p className="text-gray-500 mt-3">
          Discover courses and develop new skills.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg flex-1"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-10">Loading courses...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-10">No courses found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
