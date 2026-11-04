
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, JOB_TYPES, fmtDate } from '../api.js';

export default function Home() {
  const [f, setF] = useState({
    q: '',
    location: '',
    type: '',
  });

  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    jobs: [],
    pages: 1,
    total: 0,
  });

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stale = false;

    setLoading(true);

    const t = setTimeout(() => {
      api('/jobs?' + new URLSearchParams({ ...f, page }))
        .then((d) => {
          if (!stale) {
            setData(d);
            setErr('');
          }
        })
        .catch((e) => !stale && setErr(e.message))
        .finally(() => !stale && setLoading(false));
    }, 250);

    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [f, page]);

  const set = (k) => (e) => {
    setPage(1);
    setF({ ...f, [k]: e.target.value });
  };

  return (
    <>
      <section className="hero">
        <h1>Open roles, straight from the people hiring.</h1>

        <div className="filters">
          <input
            placeholder="Job title, company or skill"
            value={f.q}
            onChange={set('q')}
            aria-label="Search jobs"
          />

          <input
            placeholder="Location"
            value={f.location}
            onChange={set('location')}
            aria-label="Location"
          />

          <select
            value={f.type}
            onChange={set('type')}
            aria-label="Job type"
          >
            <option value="">Any type</option>
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </section>

      {err && <p className="error">{err}</p>}

      <p className="count">
        {loading
          ? 'Searching…'
          : `${data.total} open ${
              data.total === 1 ? 'role' : 'roles'
            }`}
      </p>

      <ul className="board">
        {data.jobs.map((j) => (
          <li
            key={j._id}
            className={`row t-${j.type
              .toLowerCase()
              .replace(/[^a-z]/g, '')}`}
          >
            <Link to={`/jobs/${j._id}`}>
              <div>
                <h2>{j.title}</h2>
                <p>
                  {j.company} – {j.location}
                </p>

                <p className="tags">
                  {j.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </p>
              </div>

              <div className="meta">
                <strong>{j.type}</strong>
                {j.salary && <span>{j.salary}</span>}
                <span>{fmtDate(j.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {!loading && !err && data.jobs.length === 0 && (
        <p className="note">
          No roles match these filters. Clear a filter or try a broader
          search. On a fresh install, run <code>npm run seed</code> in
          the server folder.
        </p>
      )}

      {data.pages > 1 && (
        <div className="pager">
          <button
            className="btn ghost small"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {data.pages}
          </span>

          <button
            className="btn ghost small"
            disabled={page >= data.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
