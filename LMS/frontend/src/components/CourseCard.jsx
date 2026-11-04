import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition">
      <img
        src={course.thumbnail || "https://placehold.co/600x300"}
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <span className="text-indigo-600 text-sm">
          {course.category}
        </span>

        <h3 className="text-xl font-bold mt-2">
          {course.title}
        </h3>

        <p className="text-gray-500 mt-2 line-clamp-2">
          {course.description}
        </p>

        <div className="flex justify-between items-center mt-5">
          <span className="text-sm text-gray-500">
            {course.level}
          </span>

          <Link
            to={`/courses/${course._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
          >
            <BookOpen size={16} /> View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
