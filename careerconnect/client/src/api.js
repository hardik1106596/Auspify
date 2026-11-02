const BASE = import.meta.env.VITE_API_URL || '/api';
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
export const STATUSES = ['pending', 'reviewed', 'shortlisted', 'rejected'];

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('cc_token');
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
