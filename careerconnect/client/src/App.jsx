import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import JobDetail from './pages/JobDetail.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="note">Loading your account…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <header className="top">
        <div className="wrap bar">
          <Link to="/" className="brand">Career<b>Connect</b></Link>
          <nav>
            <NavLink to="/" end>Jobs</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">{user.role === 'employer' ? 'Employer desk' : 'My applications'}</NavLink>
                <button className="link" onClick={() => { logout(); nav('/'); }}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <Link to="/register" className="btn small">Create account</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="*" element={<p className="note">That page does not exist. <Link to="/">Browse jobs</Link></p>} />
        </Routes>
      </main>
      <footer className="wrap foot">CareerConnect – a learning project. Do not store real personal data.</footer>
    </>
  );
}
