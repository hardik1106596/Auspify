import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';

async function getEnrolledCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.courseId)) {
    res.status(404).json({ message: 'Course not found.' });
    return null;
  }
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404).json({ message: 'Course not found.' });
    return null;
  }
  const allowed = req.user.role === 'admin' || course.instructor.toString() === req.user.id ||
    await Enrollment.exists({ learner: req.user.id, course: course.id });
  if (!allowed) {
    res.status(403).json({ message: 'Enroll in this course to access learning progress.' });
    return null;
  }
  return course;
}

export async function getProgress(req, res) {
  const course = await getEnrolledCourse(req, res);
  if (!course) return;
  const progress = await Progress.findOne({ learner: req.user.id, course: course.id });
  res.json({ progress: progress || { completedLessons: [] } });
}

export async function updateProgress(req, res) {
  const course = await getEnrolledCourse(req, res);
  if (!course) return;
  const lessonId = req.body.lessonId;
  if (!mongoose.isValidObjectId(lessonId) || !course.lessons.id(lessonId)) {
    return res.status(400).json({ message: 'Choose a valid lesson in this course.' });
  }
  const progress = await Progress.findOneAndUpdate(
    { learner: req.user.id, course: course.id },
    { $addToSet: { completedLessons: lessonId } },
    { new: true, upsert: true, runValidators: true },
  );
  res.json({ progress });
}
