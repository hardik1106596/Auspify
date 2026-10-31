const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "reviewing", "shortlisted", "rejected"], default: "pending" },
  coverLetter: { type: String, default: "" }
}, { timestamps: true });
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);
