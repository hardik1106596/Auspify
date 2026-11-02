import 'dotenv/config';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';

const EMAIL = 'sample-employer@careerconnect.local';
const jobs = [
  ['Frontend Developer', 'Northwind Labs', 'Bengaluru, India', 'Full-time', '₹12–18 LPA', ['React', 'CSS', 'JavaScript'], 'Build fast, accessible interfaces for our analytics product. You will own features from design handoff to release.'],
  ['Node.js Backend Engineer', 'Harbor Systems', 'Remote', 'Remote', '₹15–24 LPA', ['Node.js', 'MongoDB', 'REST'], 'Design and maintain APIs that serve millions of requests. Experience with MongoDB and testing is a plus.'],
  ['UI/UX Designer', 'Pixel Orchard', 'Ahmedabad, India', 'Full-time', '₹8–14 LPA', ['Figma', 'Prototyping', 'Research'], 'Lead design for mobile and web projects, from user research to polished prototypes.'],
  ['Software Engineering Intern', 'Brightpath', 'Pune, India', 'Internship', '₹25k / month', ['JavaScript', 'Git'], 'Six-month internship working alongside senior engineers on real customer features.'],
  ['DevOps Engineer', 'Cloudloom', 'Hyderabad, India', 'Contract', '₹20–30 LPA', ['Docker', 'AWS', 'CI/CD'], 'Automate deployments and monitoring for a growing multi-service platform.'],
  ['Customer Support Specialist', 'Helpwise', 'Remote', 'Part-time', '₹30k / month', ['Communication', 'Email'], 'Answer customer questions and help improve our documentation. Flexible hours.'],
].map(([title, company, location, type, salary, skills, description]) => ({ title, company, location, type, salary, skills, description }));

await mongoose.connect(process.env.MONGO_URI);
let employer = await User.findOne({ email: EMAIL });
if (!employer) {
  employer = await User.create({
    name: 'Sample Employer', email: EMAIL, role: 'employer', company: 'Sample Company',
    password: crypto.randomBytes(24).toString('hex'), // random; nobody can log in as this account
  });
}
await Job.deleteMany({ employer: employer._id });
await Job.insertMany(jobs.map((j) => ({ ...j, employer: employer._id })));
console.log(`Seeded ${jobs.length} sample jobs.`);
await mongoose.disconnect();
