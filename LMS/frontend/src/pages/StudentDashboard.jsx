import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api('/enrollments/mine')
      .then(({ enrollments: data }) => { if (active) setEnrollments(data); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);
  return (
    <section className="section">
      <p className="eyebrow">LEARNER DASHBOARD</p><h1>Welcome back</h1><p>Continue learning where you left off.</p>
      {error && <p className="error" role="alert">{error}</p>}
      {!error && enrollments.length === 0 && <p className="notice">You have not enrolled in a course yet. <Link to="/courses">Explore courses</Link></p>}
      <div className="course-grid">{enrollments.map(({ _id, course, progress }) => course && (
        <article className="course-card course-card-content" key={_id}>
          <p className="eyebrow">MY LEARNING</p><h2>{course.title}</h2><p>{course.description}</p>
          <p>{progress?.completedLessons?.length || 0} lessons completed</p><Link to={`/courses/${course._id}`}>Continue course →</Link>
        </article>
      ))}</div>
    </section>
  );
}
