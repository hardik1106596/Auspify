
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmtDate, JOB_TYPES, STATUSES } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

function SeekerView() {
  const [apps, setApps] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api('/applications/mine')
      .then((d) => setApps(d.applications))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="error">{err}</p>;
  if (!apps) return <p className="note">Loading…</p>;

  return (
    <>
      <h1>My applications</h1>

      {apps.length === 0 && (
        <p className="note">
          You have not applied yet. <Link to="/">Browse open roles</Link>
        </p>
      )}

      <ul className="board">
        {apps.map((a) => (
          <li key={a._id} className="row plain">
            <div className="inner">
              <div>
                <h2>
                  {a.job ? (
                    <Link to={`/jobs/${a.job._id}`}>
                      {a.job.title}
                    </Link>
                  ) : (
                    'Job removed'
                  )}
                </h2>
                <p>
                  {a.job?.company} – applied {fmtDate(a.createdAt)}
                </p>
              </div>

              <span className={`status ${a.status}`}>
                {a.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

const blank = {
  title: '',
  location: '',
  type: 'Full-time',
  salary: '',
  skills: '',
  description: '',
};

function EmployerView({ user }) {
  const [tab, setTab] = useState('apps');
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(blank);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = useCallback(async () => {
    try {
      const [j, a] = await Promise.all([
        api('/jobs/mine'),
        api('/applications/received'),
      ]);

      setJobs(j.jobs);
      setApps(a.applications);
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const run = async (fn, okText) => {
    try {
      await fn();
      setMsg({ type: 'ok', text: okText });
      await load();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const post = (e) => {
    e.preventDefault();

    run(async () => {
      await api('/jobs', {
        method: 'POST',
        body: { ...form, company: user.company },
      });

      setForm(blank);
      setTab('jobs');
    }, 'Job published');
  };

  return (
    <>
      <h1>
        Employer desk <small>{user.company}</small>
      </h1>

      <div className="tabs">
        {[
          ['apps', `Applications (${apps.length})`],
          ['jobs', `My jobs (${jobs.length})`],
          ['new', 'Post a job'],
        ].map(([k, l]) => (
          <button
            key={k}
            className={tab === k ? 'on' : ''}
            onClick={() => {
              setTab(k);
              setMsg({ type: '', text: '' });
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {msg.text && <p className={msg.type}>{msg.text}</p>}

      {tab === 'apps' && (
        <ul className="board">
          {apps.length === 0 && (
            <p className="note">No applications yet.</p>
          )}

          {apps.map((a) => (
            <li key={a._id} className="row plain">
              <div className="inner col">
                <div className="split">
                  <div>
                    <h2>
                      {a.seeker?.name || 'Deleted user'}{' '}
                      <span className="muted">
                        for {a.job?.title}
                      </span>
                    </h2>

                    <p>
                      {a.seeker?.email && (
                        <a href={`mailto:${a.seeker.email}`}>
                          {a.seeker.email}
                        </a>
                      )}{' '}
                      – {fmtDate(a.createdAt)}
                    </p>
                  </div>

                  <select
                    value={a.status}
                    aria-label="Application status"
                    onChange={(e) =>
                      run(
                        () =>
                          api(`/applications/${a._id}/status`, {
                            method: 'PATCH',
                            body: { status: e.target.value },
                          }),
                        'Status updated'
                      )
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {a.coverLetter && (
                  <p className="letter">{a.coverLetter}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === 'jobs' && (
        <ul className="board">
          {jobs.length === 0 && (
            <p className="note">
              You have not posted a job yet.
            </p>
          )}

          {jobs.map((j) => (
            <li key={j._id} className="row plain">
              <div className="inner">
                <div>
                  <h2>{j.title}</h2>
                  <p>
                    {j.location} – {j.type} –{' '}
                    {j.active ? 'Open' : 'Closed'}
                  </p>
                </div>

                <div className="actions">
                  <button
                    className="btn ghost small"
                    onClick={() =>
                      run(
                        () =>
                          api(`/jobs/${j._id}`, {
                            method: 'PATCH',
                            body: { active: !j.active },
                          }),
                        j.active ? 'Job closed' : 'Job reopened'
                      )
                    }
                  >
                    {j.active ? 'Close' : 'Reopen'}
                  </button>

                  <button
                    className="btn danger small"
                    onClick={() =>
                      window.confirm(
                        'Delete this job and its applications?'
                      ) &&
                      run(
                        () =>
                          api(`/jobs/${j._id}`, {
                            method: 'DELETE',
                          }),
                        'Job deleted'
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === 'new' && (
        <form className="card" onSubmit={post}>
          <label>
            Job title
            <input
              required
              maxLength="120"
              value={form.title}
              onChange={set('title')}
            />
          </label>

          <div className="two">
            <label>
              Location
              <input
                required
                value={form.location}
                onChange={set('location')}
              />
            </label>

            <label>
              Type
              <select value={form.type} onChange={set('type')}>
                {JOB_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="two">
            <label>
              Salary (optional)
              <input
                value={form.salary}
                onChange={set('salary')}
                placeholder="e.g. ₹10–15 LPA"
              />
            </label>

            <label>
              Skills (comma separated)
              <input
                value={form.skills}
                onChange={set('skills')}
                placeholder="React, Node.js"
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              required
              rows="8"
              maxLength="5000"
              value={form.description}
              onChange={set('description')}
            />
          </label>

          <button className="btn">Publish job</button>
        </form>
      )}
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user.role === 'seeker') return <SeekerView />;
  if (user.role === 'employer') return <EmployerView user={user} />;

  return (
    <p className="note">
      Admin accounts have no dashboard in this starter. Add moderation
      tools before production.
    </p>
  );
}
