import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Quiz from '../models/Quiz.js';

export async function listCourseQuizzes(req, res) {
  if (!mongoose.isValidObjectId(req.params.courseId)) return res.status(404).json({ message: 'Course not found.' });
  const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.correctAnswer');
  res.json({ quizzes });
}

export async function createQuiz(req, res) {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only manage quizzes for your own courses.' });
  }
  const quiz = await Quiz.create({ ...req.body, course: course.id });
  res.status(201).json({ quiz });
}

export async function submitQuiz(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Quiz not found.' });
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
  const enrolled = await Enrollment.exists({ learner: req.user.id, course: quiz.course });
  if (!enrolled) return res.status(403).json({ message: 'Enroll in this course before submitting its quiz.' });
  if (!Array.isArray(req.body.answers) || req.body.answers.length !== quiz.questions.length) {
    return res.status(400).json({ message: 'Provide an answer for every question.' });
  }
  const correct = quiz.questions.reduce((total, question, index) => total + (req.body.answers[index] === question.correctAnswer ? 1 : 0), 0);
  res.json({ score: correct, total: quiz.questions.length });
}
