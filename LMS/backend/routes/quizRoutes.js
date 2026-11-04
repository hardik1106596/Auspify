import { Router } from 'express';
import { createQuiz, listCourseQuizzes, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();
router.get('/course/:courseId', protect, listCourseQuizzes);
router.post('/course/:courseId', protect, requireRole('instructor', 'admin'), createQuiz);
router.post('/:id/submit', protect, requireRole('learner'), submitQuiz);
export default router;
