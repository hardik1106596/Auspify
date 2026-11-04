import { Router } from 'express';
import { enroll, listMyEnrollments } from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();
router.use(protect);
router.post('/:courseId', requireRole('learner'), enroll);
router.get('/mine', requireRole('learner'), listMyEnrollments);
export default router;
