import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch(() => setMessage("Course not found."));
  }, [id]);

  const enroll = async () => {
    try {
      await api.post(`/enrollments/${id}`);
      setMessage("Successfully enrolled!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Enrollment failed.");
    }
  };

  if (!course) {
    return <MainLayout><div className="p-10">{message || "Loading..."}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-8">
        <img
          src={course.thumbnail || "https://placehold.co/1200x400"}
          alt={course.title}
          className="w-full h-72 object-cover rounded-2xl"
        />

        <h1 className="text-4xl font-bold mt-8">{course.title}</h1>
        <p className="text-gray-500 mt-3">
          Instructor: {course.instructor?.name}
        </p>

        <p className="mt-6">{course.description}</p>

        <button
          onClick={enroll}
          disabled={!user || user.role !== "student"}
          className="bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg mt-8"
        >
          Enroll Now
        </button>

        {message && <p className="mt-4">{message}</p>}

        <h2 className="text-2xl font-bold mt-12">Course Lessons</h2>

        <div className="mt-5 space-y-3">
          {course.lessons.map((lesson, index) => (
            <div key={lesson._id} className="border p-4 rounded-lg">
              {index + 1}. {lesson.title}
              <p className="text-gray-500">{lesson.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
