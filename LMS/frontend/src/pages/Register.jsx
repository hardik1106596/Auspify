import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <p className="eyebrow">GET STARTED</p><h1>Create an account</h1>
      <label>Full name<input autoComplete="name" required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password (8+ characters)<input type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <label>Account type<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="learner">Learner</option><option value="instructor">Instructor</option></select></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      <p>Already registered? <Link to="/login">Sign in</Link></p>
    </form>
  );
}
