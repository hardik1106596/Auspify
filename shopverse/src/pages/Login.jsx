import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const authData = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      signIn(authData);
      navigate(location.state?.from?.pathname || '/profile', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark"><ShoppingBag size={22} /></span>
          <span>Shop<span>Verse</span></span>
        </div>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Good to see you again.</h1>
        <p className="auth-intro">Sign in to pick up where you left off.</p>

        <form className="account-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <span className="input-with-icon">
              <Mail size={17} />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </span>
          </label>
          <label>
            Password
            <span className="input-with-icon">
              <LockKeyhole size={17} />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </span>
          </label>
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          <button className="btn btn-dark full" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          New to ShopVerse? <Link to="/register">Create an account</Link>
        </p>
      </section>
      <aside className="auth-aside">
        <div>
          <span className="auth-aside-label">YOUR EVERYDAY, UPGRADED</span>
          <h2>Find the little things that make every day.</h2>
          <p>Thoughtful picks, a smoother checkout, and all your orders in one place.</p>
        </div>
      </aside>
    </main>
  );
}
