const Application = require("../models/Application");
const Job = require("../models/Job");

exports.apply = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, status: "open" });
    if (!job) return res.status(404).json({ message: "This job is no longer available." });
    if (String(job.employer) === String(req.user._id)) return res.status(400).json({ message: "You cannot apply to your own job." });
    const application = await Application.create({ job: job._id, seeker: req.user._id });
    res.status(201).json({ application, message: "Application submitted." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You have already applied for this job." });
    res.status(500).json({ message: "Could not submit application." });
  }
};
exports.mine = async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id }).sort({ createdAt: -1 }).populate("job", "title company location");
  res.json({ applications });
};
exports.received = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).select("_id");
  const applications = await Application.find({ job: { $in: jobs.map(j => j._id) } }).sort({ createdAt: -1 }).populate("job", "title company").populate("seeker", "name email headline skills");
  res.json({ applications });
};
exports.updateStatus = async (req, res) => {
  const allowed = ["pending", "reviewing", "shortlisted", "rejected"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid application status." });
  const application = await Application.findById(req.params.id).populate("job");
  if (!application || String(application.job.employer) !== String(req.user._id)) return res.status(404).json({ message: "Application not found." });
  application.status = req.body.status;
  await application.save();
  res.json({ application });
};
