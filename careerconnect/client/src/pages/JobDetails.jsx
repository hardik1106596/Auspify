import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, BriefcaseBusiness, Wallet } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const {id}=useParams(); const {user}=useAuth();
  const [job,setJob]=useState(null); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{api.get(`/jobs/${id}`).then(({data})=>setJob(data.job)).catch(()=>setMessage("This job could not be found."));},[id]);
  const apply=async()=>{setBusy(true);setMessage("");try{await api.post(`/applications/${id}`);setMessage("Application submitted. You can track it from your dashboard.");}catch(e){setMessage(e.response?.data?.message||"Please log in as a job seeker to apply.");}finally{setBusy(false);}};
  if(!job)return <><Navbar/><div className="empty-state">{message||"Loading job..."}</div></>;
  return <><Navbar/><main className="page-shell detail-shell"><Link to="/jobs" className="back-link"><ArrowLeft size={16}/> Back to opportunities</Link><div className="detail-layout"><article className="detail-content"><div className="page-kicker">{job.company} · {job.workMode}</div><h1>{job.title}</h1><div className="detail-facts"><span><MapPin/>{job.location}</span><span><BriefcaseBusiness/>{job.type}</span><span><Wallet/>{job.salary||"Salary not disclosed"}</span></div><div className="detail-block"><h2>About the role</h2><p>{job.description}</p></div>{job.requirements?.length>0&&<div className="detail-block"><h2>What we're looking for</h2><ul>{job.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul></div>}</article><aside className="apply-card"><span className="page-kicker">YOUR NEXT CHAPTER</span><h3>Sound like a fit?</h3><p>Take the next step and introduce yourself to the team.</p>{user?.role==="seeker"?<button className="button button-dark full-width" disabled={busy} onClick={apply}>{busy?"Applying...":"Apply for this role"}</button>:<Link to="/login" className="button button-dark full-width">Log in to apply</Link>}{message&&<p className="form-message">{message}</p>}<small>Applications are managed securely through CareerConnect.</small></aside></div></main></>;
}
