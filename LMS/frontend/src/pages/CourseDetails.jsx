import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api(`/courses/${id}`)
      .then(({ course: result }) => { if (active) setCourse(result); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!course || user?.role !== 'learner') return;
    let active = true;
    api(`/progress/${id}`)
      .then(({ progress }) => {
        if (active) {
          setEnrolled(true);
          setCompletedLessons(progress.completedLessons.map((lesson) => String(lesson)));
        }
      })
      .catch(() => {
        if (active) setEnrolled(false);
      });
    return () => { active = false; };
  }, [course, id, user]);

  async function enroll() {
    setBusy(true);
    setMessage('');
    try {
      await api(`/enrollments/${id}`, { method: 'POST' });
      setEnrolled(true);
      setMessage('You are enrolled. Find this course in My learning.');
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function completeLesson(lessonId) {
    setBusy(true);
    setMessage('');
    try {
      const { progress } = await api(`/progress/${id}`, {
        method: 'PUT',
        body: { lessonId },
      });
      setCompletedLessons(progress.completedLessons.map((lesson) => String(lesson)));
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="error" role="alert">{error} <Link to="/courses">Browse courses</Link></p>;
  if (!course) return <p className="notice">Loading course...</p>;
  const canEnroll = user?.role === 'learner';

  return (
    <article className="detail-card">
      <p className="eyebrow">{course.category} · {course.level}</p>
      <h1>{course.title}</h1>
      <p className="lead">{course.description}</p>
      <p>Instructor: {course.instructor?.name || 'Auspify instructor'}</p>
      <section className="section">
        <h2>What you will learn</h2>
        {course.learningOutcomes?.length ? <ul>{course.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Course outcomes will be added soon.</p>}
      </section>
      <section className="section">
        <h2>Lessons</h2>
        {course.lessons?.length ? <ol>{course.lessons.map((lesson) => (
          <li key={lesson._id || lesson.title}>
            <strong>{lesson.title}</strong>
            {lesson.description && <p>{lesson.description}</p>}
            {enrolled && <button className="text-button" disabled={busy || completedLessons.includes(String(lesson._id))} onClick={() => completeLesson(lesson._id)}>
              {completedLessons.includes(String(lesson._id)) ? 'Completed' : 'Mark complete'}
            </button>}
          </li>
        ))}</ol> : <p>Lessons will be added soon.</p>}
      </section>
      {canEnroll && !enrolled && <button className="button" onClick={enroll} disabled={busy}>{busy ? 'Enrolling...' : 'Enroll in this course'}</button>}
      {enrolled && <p className="notice" role="status">{completedLessons.length} of {course.lessons.length} lessons completed.</p>}
      {!user && <p><Link to="/login">Sign in</Link> as a learner to enroll.</p>}
      {message && <p className="notice" role="status">{message}</p>}
    </article>
  );
}
