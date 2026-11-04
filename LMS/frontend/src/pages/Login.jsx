import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <p className="eyebrow">WELCOME BACK</p><h1>Sign in</h1>
      <label>Email<input type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      <p>New to Auspify Learn? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
