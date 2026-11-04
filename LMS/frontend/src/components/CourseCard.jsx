import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="course-art" aria-hidden="true">{course.category?.slice(0, 1) || 'L'}</div>
      <div className="course-card-content">
        <p className="eyebrow">{course.category || 'Course'} · {course.level || 'All levels'}</p>
        <h3><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
        <p>{course.description}</p>
        <div className="course-card-footer">
          <span>{course.instructor?.name || 'Auspify instructor'}</span>
          <Link to={`/courses/${course._id}`}>View course →</Link>
        </div>
      </div>
    </article>
  );
}
