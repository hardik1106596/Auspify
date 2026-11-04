
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (user) =>
  jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const str = (v) => (typeof v === 'string' ? v.trim() : '');

router.post('/register', async (req, res) => {
  const name = str(req.body.name);
  const email = str(req.body.email).toLowerCase();

  const password =
    typeof req.body.password === 'string'
      ? req.body.password
      : '';

  const role = req.body.role === 'employer'
    ? 'employer'
    : 'seeker'; // admin is never self-assignable

  const company = str(req.body.company);

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
    });
  }

  if (!emailRe.test(email)) {
    return res.status(400).json({
      message: 'Enter a valid email address',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters',
    });
  }

  if (role === 'employer' && !company) {
    return res.status(400).json({
      message: 'Company name is required for employers',
    });
  }

  if (await User.exists({ email })) {
    return res.status(409).json({
      message: 'An account with this email already exists',
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    company: role === 'employer' ? company : undefined,
  });

  res.status(201).json({
    token: sign(user),
    user: user.toPublic(),
  });
});

router.post('/login', async (req, res) => {
  const email = str(req.body.email).toLowerCase();

  const password =
    typeof req.body.password === 'string'
      ? req.body.password
      : '';

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      message: 'Incorrect email or password',
    });
  }

  res.json({
    token: sign(user),
    user: user.toPublic(),
  });
});

router.get('/me', protect, (req, res) =>
  res.json({ user: req.user.toPublic() })
);

export default router;
