import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { editProfile, fetchDashboard, fetchProfile } from '../controllers/userController.js';

const router = Router();

router.get('/profile', protect, fetchProfile);
router.put('/profile', protect, editProfile);
router.get('/dashboard', protect, fetchDashboard);

export default router;