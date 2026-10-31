const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["seeker", "employer", "admin"], default: "seeker" },
  headline: { type: String, default: "" },
  skills: [{ type: String, trim: true }],
  company: { type: String, default: "" }
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
