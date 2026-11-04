import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

const emptyCourse = { title: '', description: '', category: '', level: 'Beginner', lessons: '' };

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourse);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadCourses() {
    try {
      const { courses: data } = await api('/courses/mine');
      setCourses(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  useEffect(() => { loadCourses(); }, []);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const lessons = form.lessons.split('\n').map((title) => title.trim()).filter(Boolean).map((title) => ({ title }));
      await api('/courses', { method: 'POST', body: { ...form, lessons } });
      setForm(emptyCourse);
      setNotice('Course created.');
      await loadCourses();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <p className="eyebrow">INSTRUCTOR DASHBOARD</p><h1>Manage your courses</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {notice && <p className="notice" role="status">{notice}</p>}
      <form className="form-card form-card-wide" onSubmit={submit}>
        <h2>Create a course</h2>
        <label>Course title<input required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Description<textarea required maxLength={3000} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <div className="form-row">
          <label>Category<input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <label>Level<select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
        </div>
        <label>Lessons (one title per line)<textarea rows={4} value={form.lessons} onChange={(e) => setForm({ ...form, lessons: e.target.value })} /></label>
        <button className="button" disabled={busy}>{busy ? 'Creating...' : 'Create course'}</button>
      </form>
      <h2 className="section">Your courses</h2>
      {courses.map((course) => <p key={course._id}><Link to={`/courses/${course._id}`}>{course.title}</Link> · {course.published ? 'Published' : 'Draft'}</p>)}
    </section>
  );
}
