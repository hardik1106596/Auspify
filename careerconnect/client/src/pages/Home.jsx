import { ArrowRight, ArrowUpRight, Search, Sparkles, Users, Building2, MoveUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

const categories = ["Engineering", "Design", "Marketing", "Product", "Data & Analytics", "Customer success"];
export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return <>
    <Navbar/>
    <main>
      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> A better way to work <span className="eyebrow-pill">Built for what's next</span></div>
          <h1>Find work that<br/> <em>moves you</em> forward.</h1>
          <p className="hero-text">Less scrolling. More possibility. Discover thoughtful opportunities from teams building the future.</p>
          <form className="hero-search" onSubmit={(e) => { e.preventDefault(); navigate(`/jobs?q=${encodeURIComponent(q)}`); }}>
            <Search size={19}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Job title, skill or company..."/><button className="button button-dark">Explore jobs <ArrowUpRight size={16}/></button>
          </form>
          <div className="hero-note"><span className="avatar-stack"><i>H</i><i>M</i><i>A</i></span><span>Made for people ready for their next chapter.</span></div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
          <div className="art-note note-top"><span className="note-icon"><Sparkles size={17}/></span><div><b>Your next chapter</b><small>Starts with one search</small></div></div>
          <div className="art-card">
            <div className="art-card-top"><span className="live-dot"/> FRESH OPPORTUNITY <span className="art-arrow"><ArrowUpRight size={17}/></span></div>
            <div className="art-company">N<span>✳</span></div>
            <h3>Product Designer</h3><p>Northstar Studio · Remote</p>
            <div className="art-chips"><span>Full-time</span><span>Design</span></div>
            <div className="art-divider"/><div className="art-bottom"><span><b>$90k–120k</b><small>Annual salary</small></span><span className="match">Great fit ↗</span></div>
          </div>
          <div className="art-note note-bottom"><div className="mini-avatars"><i>J</i><i>K</i><i>R</i></div><div><b>Good people.</b><small>Good work. Better together.</small></div></div>
          <div className="art-stamp">MAKE<br/>YOUR<br/>MOVE<span>↗</span></div>
        </div>
      </section>

      <section className="ticker"><div className="ticker-inner"><span>OPPORTUNITY, WITHOUT THE NOISE</span><i>✳</i><span>YOUR NEXT CHAPTER STARTS HERE</span><i>✳</i><span>GOOD WORK FINDS GOOD PEOPLE</span></div></section>

      <section className="section-shell category-section">
        <div className="section-heading"><div><div className="eyebrow">EXPLORE BY INTEREST</div><h2>Find your <em>kind</em> of work.</h2></div><Link className="under-link" to="/jobs">All opportunities <ArrowUpRight size={16}/></Link></div>
        <div className="category-grid">{categories.map((c,i)=><Link to={`/jobs?category=${encodeURIComponent(c)}`} className="category-card" key={c}><span className="category-number">0{i+1}</span><strong>{c}</strong><ArrowUpRight size={18}/></Link>)}</div>
      </section>

      <section className="how-section" id="how-it-works"><div className="section-shell how-inner">
        <div className="how-intro"><div className="eyebrow">A LITTLE LESS COMPLICATED</div><h2>Good things happen<br/>when it <em>clicks.</em></h2><p>A clear path from curious to hired. No maze, no mystery.</p><Link to="/jobs" className="button button-dark">Find your next role <ArrowRight size={16}/></Link></div>
        <div className="steps">
          <div className="step"><span>01</span><div><h3>Find your fit</h3><p>Explore roles by skill, location, work style and the things that matter to you.</p></div><Search/></div>
          <div className="step"><span>02</span><div><h3>Make your move</h3><p>Build your profile, share your story and apply without the busywork.</p></div><MoveUpRight/></div>
          <div className="step"><span>03</span><div><h3>Keep moving</h3><p>Follow every application and stay in the loop from one simple dashboard.</p></div><Sparkles/></div>
        </div>
      </div></section>

      <section className="section-shell split-cta"><div><div className="eyebrow">HIRING WITH US?</div><h2>Meet the person<br/>behind the <em>potential.</em></h2><p>Find thoughtful candidates who are ready to make an impact.</p><Link to="/register?role=employer" className="button button-dark">Post a job <ArrowUpRight size={16}/></Link></div><div className="cta-visual"><div className="cta-circle"><Users size={45}/><span>People<br/>first.</span></div><Building2 className="cta-building"/></div></section>
    </main>
    <footer className="footer"><div className="section-shell footer-inner"><Link to="/" className="brand">career<span>connect.</span></Link><span>Made for the next move. © {new Date().getFullYear()}</span><Link to="/jobs">Explore jobs <ArrowUpRight size={14}/></Link></div></footer>
  </>;
}
