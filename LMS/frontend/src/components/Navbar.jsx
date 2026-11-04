import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <Link className="brand" to="/">Auspify<span>Learn</span></Link>
      <nav aria-label="Main navigation">
        <NavLink to="/courses">Courses</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user ? (
          <button className="text-button" onClick={logout}>Sign out</button>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <Link className="button button-small" to="/register">Get started</Link>
          </>
        )}
      </nav>
    </header>
  );
}
