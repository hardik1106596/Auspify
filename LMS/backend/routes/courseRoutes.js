import { Router } from 'express';
import { createCourse, getCourse, listCourses, listMyCourses, updateCourse } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();
router.get('/', listCourses);
router.get('/mine', protect, requireRole('instructor', 'admin'), listMyCourses);
router.get('/:id', getCourse);
router.post('/', protect, requireRole('instructor', 'admin'), createCourse);
router.put('/:id', protect, requireRole('instructor', 'admin'), updateCourse);
export default router;
