const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"], default: "Full-time" },
  workMode: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Hybrid" },
  category: { type: String, default: "Other" },
  salary: { type: String, default: "" },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });
jobSchema.index({ title: "text", company: "text", description: "text", category: "text", requirements: "text" });
module.exports = mongoose.model("Job", jobSchema);
