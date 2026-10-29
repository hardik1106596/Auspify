import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Register() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const authData = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      signIn(authData);
      navigate('/profile', { replace: true });
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
          <span className="brand-mark"><UserRound size={22} /></span>
          <span>Shop<span>Verse</span></span>
        </div>
        <span className="eyebrow">JOIN THE VERSE</span>
        <h1>Your next great find starts here.</h1>
        <p className="auth-intro">Create an account to keep your orders and details together.</p>

        <form className="account-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <span className="input-with-icon">
              <UserRound size={17} />
              <input
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </span>
          </label>
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
                autoComplete="new-password"
                minLength={8}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </span>
          </label>
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          <button className="btn btn-dark full" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
      <aside className="auth-aside">
        <div>
          <span className="auth-aside-label">GOOD FINDS, ALL TOGETHER</span>
          <h2>A little more you in every discovery.</h2>
          <p>Save your details once and keep your ShopVerse shopping in sync.</p>
        </div>
      </aside>
    </main>
  );
}
