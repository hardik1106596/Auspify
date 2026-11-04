import { useCourses } from './Courses.jsx';

export default function AdminDashboard() {
  const { courses, loading, error } = useCourses();
  return (
    <section className="section">
      <p className="eyebrow">ADMIN DASHBOARD</p><h1>Platform overview</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {loading ? <p className="notice">Loading platform data...</p> : (
        <div className="stats-grid"><article className="stat-card"><strong>{courses.length}</strong><span>Published courses</span></article></div>
      )}
      <p>Manage trusted administrator accounts directly in the database.</p>
    </section>
  );
}
