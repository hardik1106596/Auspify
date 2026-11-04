import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Your account is no longer available.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Your session is invalid or expired. Please sign in again.' });
  }
}
