import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);
router.get('/:courseId', getProgress);
router.put('/:courseId', updateProgress);
export default router;
