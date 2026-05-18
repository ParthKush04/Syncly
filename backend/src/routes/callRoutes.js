import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createCall, endCall } from '../controllers/callController.js';

const router = Router();

router.post('/create', protect, createCall);
router.post('/end', protect, endCall);

export default router;