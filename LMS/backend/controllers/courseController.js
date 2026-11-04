import mongoose from 'mongoose';
import Course from '../models/Course.js';

export async function listCourses(req, res) {
  const filter = { published: true };
  if (typeof req.query.category === 'string' && req.query.category.trim()) filter.category = req.query.category.trim();
  const courses = await Course.find(filter).populate('instructor', 'name').sort({ createdAt: -1 });
  res.json({ courses });
}

export async function getCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Course not found.' });
  const course = await Course.findOne({ _id: req.params.id, published: true }).populate('instructor', 'name');
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  res.json({ course });
}

export async function listMyCourses(req, res) {
  const filter = req.user.role === 'admin' ? {} : { instructor: req.user.id };
  const courses = await Course.find(filter).populate('instructor', 'name').sort({ createdAt: -1 });
  res.json({ courses });
}

export async function createCourse(req, res) {
  const course = await Course.create({ ...req.body, instructor: req.user.id });
  res.status(201).json({ course });
}

export async function updateCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Course not found.' });
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only manage your own courses.' });
  }
  const allowed = ['title', 'description', 'category', 'level', 'lessons', 'learningOutcomes', 'published'];
  for (const key of allowed) if (req.body[key] !== undefined) course.set(key, req.body[key]);
  await course.save();
  res.json({ course });
}
