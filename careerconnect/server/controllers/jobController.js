const Job = require("../models/Job");

exports.list = async (req, res) => {
  try {
    const { q, category, type } = req.query;
    const filter = { status: "open" };
    if (type) filter.type = type;
    if (category) filter.category = new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (q) filter.$or = ["title", "company", "description", "category", "requirements"].map(field => ({ [field]: { $regex: q, $options: "i" } }));
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100).populate("employer", "name");
    res.json({ jobs });
  } catch (error) { res.status(500).json({ message: "Could not fetch jobs." }); }
};
exports.getOne = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, status: "open" }).populate("employer", "name");
  if (!job) return res.status(404).json({ message: "Job not found." });
  res.json({ job });
};
exports.create = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;
    if (!title || !company || !location || !description) return res.status(400).json({ message: "Title, company, location and description are required." });
    const job = await Job.create({ ...req.body, employer: req.user._id });
    res.status(201).json({ job });
  } catch (error) { res.status(500).json({ message: "Could not create job.", detail: error.message }); }
};
exports.mine = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
  res.json({ jobs });
};
exports.update = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found." });
  Object.assign(job, req.body);
  await job.save();
  res.json({ job });
};
exports.remove = async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found." });
  res.json({ message: "Job deleted." });
};
