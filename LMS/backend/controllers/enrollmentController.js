import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';

export async function enroll(req, res) {
  if (!mongoose.isValidObjectId(req.params.courseId)) return res.status(404).json({ message: 'Course not found.' });
  const course = await Course.findOne({ _id: req.params.courseId, published: true });
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  try {
    const enrollment = await Enrollment.create({ learner: req.user.id, course: course.id });
    return res.status(201).json({ enrollment });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'You are already enrolled in this course.' });
    throw error;
  }
}

export async function listMyEnrollments(req, res) {
  const enrollments = await Enrollment.find({ learner: req.user.id })
    .populate('course')
    .sort({ enrolledAt: -1 })
    .lean();
  const progressRows = await Progress.find({ learner: req.user.id }).lean();
  const progressByCourse = new Map(progressRows.map((progress) => [progress.course.toString(), progress]));
  for (const enrollment of enrollments) {
    enrollment.progress = progressByCourse.get(enrollment.course?._id.toString()) || { completedLessons: [] };
  }
  res.json({ enrollments });
}
