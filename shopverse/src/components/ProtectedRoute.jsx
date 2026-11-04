import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ProtectedRoute() {
  const { loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="account-loading" role="status">
        <span className="account-spinner" />
        <p>Loading your account...</p>
      </main>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
