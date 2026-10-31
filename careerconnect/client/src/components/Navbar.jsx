import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dashboard = user?.role === "employer" ? "/employer" : "/dashboard";
  return <header className="site-header">
    <div className="nav-wrap">
      <Link to="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={19}/></span>career<span>connect.</span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/jobs" onClick={() => setOpen(false)}>Find jobs</NavLink>
        <a href="/#how-it-works" onClick={() => setOpen(false)}>How it works</a>
        {user ? <>
          <Link to={dashboard} className="nav-dashboard">Dashboard</Link>
          <button className="text-button" onClick={() => { logout(); navigate("/"); }}>Sign out</button>
        </> : <>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/register" className="button button-dark nav-cta">Get started <ArrowUpRight size={16}/></Link>
        </>}
      </nav>
    </div>
  </header>;
}
