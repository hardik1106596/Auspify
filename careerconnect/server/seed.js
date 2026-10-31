require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Job = require("./models/Job");
const User = require("./models/User");

const sampleJobs = [
  { title: "Frontend Developer", company: "Northstar Studio", location: "Ahmedabad, Gujarat", type: "Full-time", workMode: "Hybrid", category: "Engineering", salary: "₹6–9 LPA", description: "Build accessible, thoughtful web experiences with a collaborative product team. Work closely with design and backend engineering to ship reliable features.", requirements: ["React", "JavaScript", "CSS", "REST APIs"] },
  { title: "Product Design Intern", company: "Morrow Labs", location: "Remote, India", type: "Internship", workMode: "Remote", category: "Design", salary: "₹15k–25k / month", description: "Help turn complex problems into simple product experiences. You will work on flows, prototypes and a growing design system.", requirements: ["Figma", "Prototyping", "Visual design", "Communication"] },
  { title: "Backend Engineer", company: "Orbit Systems", location: "Vadodara, Gujarat", type: "Full-time", workMode: "On-site", category: "Engineering", salary: "₹8–12 LPA", description: "Design and maintain dependable APIs and data services. Collaborate with frontend engineers and product teams to deliver secure features.", requirements: ["Node.js", "Express", "MongoDB", "API design"] },
  { title: "Data Analyst Intern", company: "Fieldnote", location: "Remote, India", type: "Internship", workMode: "Remote", category: "Data & Analytics", salary: "₹12k–18k / month", description: "Support business teams with clean data, clear reporting and useful analysis. Turn questions into measurable insights.", requirements: ["SQL", "Excel", "Python", "Data visualization"] }
];

(async () => {
  try {
    await connectDB();
    let employer = await User.findOne({ email: "demo-employer@careerconnect.local" });
    if (!employer) employer = await User.create({ name: "CareerConnect Demo", email: "demo-employer@careerconnect.local", password: "not-for-login-seed-account", role: "employer" });
    const count = await Job.countDocuments({ employer: employer._id });
    if (count === 0) await Job.insertMany(sampleJobs.map(job => ({ ...job, employer: employer._id })));
    console.log("Sample jobs ready.");
  } catch (err) { console.error(err); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
