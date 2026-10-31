import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Auth({mode}) {
  const isRegister=mode==="register"; const {login,register}=useAuth(); const navigate=useNavigate(); const location=useLocation();
  const queryRole=new URLSearchParams(location.search).get("role");
  const [form,setForm]=useState({name:"",email:"",password:"",role:queryRole==="employer"?"employer":"seeker"});
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{const user=isRegister?await register(form):await login({email:form.email,password:form.password});navigate(user.role==="employer"?"/employer":"/dashboard");}catch(err){setError(err.response?.data?.message||"Something went wrong. Please try again.");}finally{setBusy(false);}};
  return <><Navbar/><main className="auth-shell"><div className="auth-panel"><div className="auth-brand"><span className="brand-mark"><BriefcaseBusiness/></span><span>careerconnect.</span></div><div className="page-kicker">{isRegister?"START YOUR STORY":"WELCOME BACK"}</div><h1>{isRegister?<>Your next chapter<br/><em>starts here.</em></>:<>Good to see<br/><em>you again.</em></>}</h1><p>{isRegister?"Create your account and find opportunities that fit your ambition.":"Sign in to pick up where your next move begins."}</p>
    <form className="auth-form" onSubmit={submit}>{isRegister&&<label>Full name<input name="name" value={form.name} onChange={change} placeholder="Your name" required minLength="2"/></label>}<label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label><label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="At least 6 characters" required minLength="6"/></label>{isRegister&&<label>I am here to...<select name="role" value={form.role} onChange={change}><option value="seeker">Find a job</option><option value="employer">Hire great people</option></select></label>}{error&&<p className="form-error">{error}</p>}<button className="button button-dark full-width" disabled={busy}>{busy?"Please wait...":isRegister?"Create account":"Log in"} <ArrowUpRight size={16}/></button></form>
    <div className="auth-switch">{isRegister?"Already have an account?":"New to CareerConnect?"} <Link to={isRegister?"/login":"/register"}>{isRegister?"Log in":"Create an account"}</Link></div></div><aside className="auth-aside"><div className="auth-aside-shape">✳</div><div><span className="page-kicker">A BETTER WAY FORWARD</span><h2>Find the place<br/>where you <em>belong.</em></h2><p>Real opportunities. Clear next steps. A career built around what matters to you.</p></div><span className="auth-aside-foot">CAREERCONNECT / PEOPLE FIRST</span></aside></main></>;
}
