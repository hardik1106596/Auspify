import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { api } from '../services/api.js';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api('/courses')
      .then((data) => { if (active) setCourses(data.courses); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { courses, loading, error };
}

export default function Courses() {
  const { courses, loading, error } = useCourses();
  return (
    <section className="section">
      <p className="eyebrow">COURSE CATALOG</p><h1>Find your next course</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {loading ? <p className="notice">Loading courses...</p> : courses.length ? (
        <div className="course-grid">{courses.map((course) => <CourseCard key={course._id} course={course} />)}</div>
      ) : <p className="notice">There are no published courses yet.</p>}
    </section>
  );
}
