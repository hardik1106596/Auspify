
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, fmtDate } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [err, setErr] = useState('');
  const [letter, setLetter] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/jobs/${id}`)
      .then((d) => setJob(d.job))
      .catch((e) => setErr(e.message));
  }, [id]);

  async function apply(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: '', text: '' });

    try {
      await api(`/applications/${id}`, {
        method: 'POST',
        body: { coverLetter: letter },
      });

      setMsg({
        type: 'ok',
        text: 'Application sent. Track it under My applications.',
      });

      setLetter('');
    } catch (e2) {
      setMsg({ type: 'error', text: e2.message });
    } finally {
      setBusy(false);
    }
  }

  if (err) {
    return (
      <p className="error">
        {err} <Link to="/">Back to jobs</Link>
      </p>
    );
  }

  if (!job) return <p className="note">Loading job…</p>;

  return (
    <article className="detail">
      <Link to="/" className="back">
        Back to jobs
      </Link>

      <h1>{job.title}</h1>

      <p className="sub">
        {job.company} – {job.location} – {job.type}
        {job.salary ? ` – ${job.salary}` : ''}
      </p>

      <p className="tags">
        {job.skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>

      <p className="desc">{job.description}</p>

      <p className="muted">Posted {fmtDate(job.createdAt)}</p>

      <section className="panel">
        {!user && (
          <p>
            To apply, <Link to="/login">log in</Link> or{' '}
            <Link to="/register">create a job seeker account</Link>.
          </p>
        )}

        {user && user.role !== 'seeker' && (
          <p>Only job seeker accounts can apply for jobs.</p>
        )}

        {user?.role === 'seeker' && (
          <form onSubmit={apply}>
            <label>
              Cover letter (optional)
              <textarea
                rows="6"
                maxLength="3000"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="Tell the employer why you are a good fit."
              />
            </label>

            {msg.text && (
              <p className={msg.type}>{msg.text}</p>
            )}

            <button className="btn" disabled={busy}>
              {busy ? 'Sending…' : 'Apply for this job'}
            </button>
          </form>
        )}
      </section>
    </article>
  );
}
