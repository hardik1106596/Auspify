import { ArrowUpRight, MapPin, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
const colors = ["mint", "peach", "lilac", "blue"];
export default function JobCard({ job, index = 0 }) {
  return <article className="job-card">
    <div className={`company-symbol ${colors[index % colors.length]}`}>{(job.company || "C").slice(0,1).toUpperCase()}</div>
    <div className="job-main">
      <div className="job-meta"><span>{job.company}</span><span className="dot">·</span><span>{job.location}</span></div>
      <Link to={`/jobs/${job._id}`} className="job-title">{job.title}</Link>
      <div className="job-tags"><span>{job.type}</span><span>{job.workMode}</span>{job.experienceLevel && <span>{job.experienceLevel}</span>}</div>
    </div>
    <div className="job-side"><strong>{job.salary || "Salary not disclosed"}</strong><span><Clock3 size={13}/> {new Date(job.createdAt).toLocaleDateString()}</span><Link to={`/jobs/${job._id}`} className="icon-link" aria-label="View job"><ArrowUpRight size={18}/></Link></div>
  </article>;
}
