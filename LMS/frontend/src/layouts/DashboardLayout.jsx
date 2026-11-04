import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function DashboardLayout() {
  const { user } = useAuth();
  return <div className="container dashboard-layout"><Sidebar role={user.role} /><section className="dashboard-content"><Outlet /></section></div>;
}
