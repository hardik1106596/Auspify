import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-indigo-600 font-semibold">
              LEARN. GROW. ACHIEVE.
            </span>

            <h1 className="text-5xl font-bold leading-tight mt-5">
              Unlock Your
              <span className="text-indigo-600"> Learning </span>
              Potential
            </h1>

            <p className="text-gray-600 mt-6 text-lg">
              Explore expert-led courses, develop new skills,
              and track your learning journey in one platform.
            </p>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mt-8"
            >
              Explore Courses <ArrowRight />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <BookOpen size={70} className="text-indigo-600" />
            <h2 className="text-3xl font-bold mt-6">
              Learn Anything
            </h2>
            <p className="text-gray-500 mt-3">
              Start learning programming, design, business,
              and many more skills.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-8 grid md:grid-cols-3 gap-8">
        {[
          ["Expert Courses", BookOpen],
          ["Learning Community", Users],
          ["Track Achievements", Trophy],
        ].map(([title, Icon]) => (
          <div key={title} className="bg-white border rounded-xl p-8">
            <Icon className="text-indigo-600" size={36} />
            <h3 className="font-bold text-xl mt-4">{title}</h3>
          </div>
        ))}
      </section>
    </MainLayout>
  );
}
