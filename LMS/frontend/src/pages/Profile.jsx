import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <section className="form-card">
      <p className="eyebrow">YOUR ACCOUNT</p><h1>Profile</h1>
      <dl className="profile-details"><dt>Name</dt><dd>{user.name}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Role</dt><dd>{user.role}</dd></dl>
    </section>
  );
}
