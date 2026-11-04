import { Router } from 'express';
import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();
router.use(protect);

router.get('/course/:courseId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.courseId)) return res.status(404).json({ message: 'Course not found.' });
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  const allowed = req.user.role === 'admin' || course.instructor.toString() === req.user.id ||
    await Enrollment.exists({ learner: req.user.id, course: course.id });
  if (!allowed) return res.status(403).json({ message: 'Enroll in this course to view its assignments.' });
  const assignments = await Assignment.find({ course: req.params.courseId }).select('-submissions');
  res.json({ assignments });
});

router.post('/course/:courseId', requireRole('instructor', 'admin'), async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only manage assignments for your own courses.' });
  }
  const assignment = await Assignment.create({ ...req.body, course: course.id });
  res.status(201).json({ assignment });
});

router.post('/:id/submit', requireRole('learner'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Assignment not found.' });
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
  const enrolled = await Enrollment.exists({ learner: req.user.id, course: assignment.course });
  if (!enrolled) return res.status(403).json({ message: 'Enroll in this course before submitting work.' });
  if (typeof req.body.text !== 'string' || !req.body.text.trim() || req.body.text.length > 5000) {
    return res.status(400).json({ message: 'Submission must contain up to 5000 characters of text.' });
  }
  assignment.submissions.push({ learner: req.user.id, text: req.body.text.trim() });
  await assignment.save();
  res.status(201).json({ message: 'Assignment submitted.' });
});

export default router;
