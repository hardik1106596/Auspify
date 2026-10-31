const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, headline: user.headline, skills: user.skills });
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required." });
    if (password.length < 6) return res.status(400).json({ message: "Password must contain at least 6 characters." });
    if (role && !["seeker", "employer"].includes(role)) return res.status(400).json({ message: "Invalid account role." });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "An account with this email already exists." });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed, role: role || "seeker" });
    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { res.status(500).json({ message: "Could not create account.", detail: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { res.status(500).json({ message: "Could not log in." }); }
};

exports.me = (req, res) => res.json({ user: safeUser(req.user) });
