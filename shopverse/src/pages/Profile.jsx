import { useEffect, useState } from 'react';
import { ArrowRight, LogOut, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout.jsx';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Profile() {
  const { token, user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/users/profile', { token })
      .then(({ user: profile }) => {
        if (active) {
          setForm({
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || '',
          });
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const { user: updatedUser } = await apiRequest('/users/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify(form),
      });
      signIn({ token, user: { ...user, ...updatedUser } });
      setMessage('Your profile has been updated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate('/', { replace: true });
  }

  return (
    <AccountLayout
      eyebrow="YOUR ACCOUNT"
      title={`Hello, ${user?.name?.split(' ')[0] || 'Shopper'}.`}
      description="Keep your details up to date for a smoother shopping experience."
    >
      <div className="account-nav">
        <Link className="account-nav-active" to="/profile">
          <UserRound size={16} /> Profile
        </Link>
        <Link to="/orders">
          <span>▤</span> Orders <ArrowRight size={15} />
        </Link>
      </div>
      <section className="account-panel">
        <div className="panel-heading">
          <div>
            <h2>Personal details</h2>
            <p>Your email address is used to sign in to ShopVerse.</p>
          </div>
          <button className="text-button" type="button" onClick={handleSignOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>

        {loading ? (
          <div className="account-inline-loading">
            <span className="account-spinner" /> Loading profile...
          </div>
        ) : (
          <form className="account-form profile-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <span className="input-with-icon">
                <UserRound size={17} />
                <input
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </span>
            </label>
            <label>
              Email address
              <span className="input-with-icon is-disabled">
                <Mail size={17} />
                <input value={user?.email || ''} disabled />
              </span>
            </label>
            <label>
              Phone number
              <span className="input-with-icon">
                <Phone size={17} />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="Add a phone number"
                />
              </span>
            </label>
            <label>
              Delivery address
              <span className="input-with-icon">
                <MapPin size={17} />
                <textarea
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  placeholder="Add your delivery address"
                  rows="3"
                />
              </span>
            </label>
            {error && (
              <p className="form-message form-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="form-message form-success" role="status">
                {message}
              </p>
            )}
            <button className="btn btn-dark" type="submit" disabled={saving}>
              {saving ? 'Saving changes...' : 'Save changes'} <ArrowRight size={16} />
            </button>
          </form>
        )}
      </section>
    </AccountLayout>
  );
}
