import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function useSubmit(action) {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(e, body) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await action(body);
      nav('/dashboard');
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  }
  return { err, busy, submit };
}

export function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const { err, busy, submit } = useSubmit(login);
  return (
    <form className="card narrow" onSubmit={(e) => submit(e, form)}>
      <h1>Log in</h1>
      <label>Email<input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}

export function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker', company: '' });
  const { err, busy, submit } = useSubmit(register);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <form className="card narrow" onSubmit={(e) => submit(e, form)}>
      <h1>Create your account</h1>
      <div className="seg" role="radiogroup" aria-label="Account type">
        {[['seeker', 'I am looking for a job'], ['employer', 'I am hiring']].map(([v, label]) => (
          <label key={v} className={form.role === v ? 'on' : ''}>
            <input type="radio" name="role" value={v} checked={form.role === v} onChange={set('role')} />{label}
          </label>
        ))}
      </div>
      <label>Full name<input required autoComplete="name" value={form.name} onChange={set('name')} /></label>
      {form.role === 'employer' && <label>Company name<input required value={form.company} onChange={set('company')} /></label>}
      <label>Email<input type="email" required autoComplete="email" value={form.email} onChange={set('email')} /></label>
      <label>Password (8+ characters)<input type="password" required minLength="8" autoComplete="new-password" value={form.password} onChange={set('password')} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
