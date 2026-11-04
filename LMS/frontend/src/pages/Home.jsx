import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.jsx';
import { useCourses } from './Courses.jsx';

export default function Home() {
  const { courses, loading, error } = useCourses();
  return (
    <>
      <section className="hero">
        <p className="eyebrow">AUSPI-FY YOUR FUTURE</p>
        <h1>Learn something that moves you forward.</h1>
        <p>Explore practical courses, learn at your own pace, and keep track of your progress.</p>
        <Link className="button" to="/courses">Explore courses</Link>
      </section>
      <section className="section">
        <div className="section-heading"><div><p className="eyebrow">START LEARNING</p><h2>Explore courses</h2></div><Link to="/courses">Browse all →</Link></div>
        {error && <p className="error" role="alert">{error}</p>}
        {loading ? <p className="notice">Loading courses...</p> : (
          <div className="course-grid">{courses.slice(0, 3).map((course) => <CourseCard key={course._id} course={course} />)}</div>
        )}
      </section>
    </>
  );
}
