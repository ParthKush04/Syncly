import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createConversationRating } from '../controllers/ratingController.js';

const router = Router();

router.post('/submit', protect, createConversationRating);

export default router;