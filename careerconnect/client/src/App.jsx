import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";
import { EmployerDashboard, SeekerDashboard } from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

function Protected({children,roles}) {
  const {user,loading}=useAuth();
  if(loading)return <div className="loading-screen">Getting things ready...</div>;
  if(!user)return <Navigate to="/login" replace/>;
  if(roles&&!roles.includes(user.role))return <Navigate to={user.role==="employer"?"/employer":"/dashboard"} replace/>;
  return children;
}
export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/jobs" element={<Jobs/>}/>
    <Route path="/jobs/:id" element={<JobDetails/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route path="/dashboard" element={<Protected roles={["seeker"]}><SeekerDashboard/></Protected>}/>
    <Route path="/employer" element={<Protected roles={["employer"]}><EmployerDashboard/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
