import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import api from "../api";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [q,setQ] = useState(params.get("q") || "");
  const [type,setType] = useState("");
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  useEffect(() => {
    setLoading(true); setError("");
    api.get("/jobs", { params: { q: params.get("q") || "", category: params.get("category") || "", type } })
      .then(({data})=>setJobs(data.jobs))
      .catch(()=>setError("Could not load jobs. Check that the backend and MongoDB are running."))
      .finally(()=>setLoading(false));
  },[params,type]);
  const submit = e => {e.preventDefault(); setParams(q ? {q} : {});};
  return <><Navbar/><main className="page-shell">
    <div className="page-kicker">THE OPPORTUNITY BOARD</div><div className="page-title-row"><div><h1>Find your <em>next move.</em></h1><p>Good work is out there. Let's find yours.</p></div><span className="result-count">{jobs.length} OPEN ROLES</span></div>
    <form className="filter-bar" onSubmit={submit}><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title, company or skill"/><select value={type} onChange={e=>setType(e.target.value)}><option value="">All job types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select><button className="button button-dark"><SlidersHorizontal size={16}/> Search</button></form>
    <div className="listing-heading"><h2>Open opportunities</h2><span>Sorted by newest</span></div>
    {loading ? <p className="empty-state">Finding opportunities...</p> : error ? <p className="empty-state error-text">{error}</p> : jobs.length ? <div className="job-list">{jobs.map((job,i)=><JobCard key={job._id} job={job} index={i}/>)}</div> : <div className="empty-state"><span>✳</span><h3>No roles found just yet.</h3><p>Try another keyword or check back soon.</p></div>}
  </main><footer className="footer"><div className="section-shell footer-inner"><Link to="/" className="brand">career<span>connect.</span></Link><span>© {new Date().getFullYear()}</span></div></footer></>;
}
