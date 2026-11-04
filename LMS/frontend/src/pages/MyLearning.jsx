import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import CourseCard from "../components/CourseCard";

export default function MyLearning() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.get("/enrollments/my")
      .then((res) => setEnrollments(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">My Learning</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {enrollments.map((enrollment) =>
          enrollment.course ? (
            <CourseCard
              key={enrollment._id}
              course={enrollment.course}
            />
          ) : null
        )}
      </div>

      {enrollments.length === 0 && (
        <p className="mt-8 text-gray-500">
          You have not enrolled in any courses yet.
        </p>
      )}
    </DashboardLayout>
  );
}
