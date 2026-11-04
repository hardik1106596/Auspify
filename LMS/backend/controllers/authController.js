import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (user) => user.toPublic();
const signToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export async function register(req, res) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const role = ['learner', 'instructor'].includes(req.body.role) ? req.body.role : 'learner';
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
  if (!emailPattern.test(email) || email.length > 254) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ message: 'Password must be between 8 and 72 characters.' });
  if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
}

export async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Incorrect email or password.' });
  res.json({ token: signToken(user), user: publicUser(user) });
}

export function currentUser(req, res) {
  res.json({ user: publicUser(req.user) });
}
