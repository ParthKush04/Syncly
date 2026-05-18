import { Router } from 'express';
import { generateStreamToken } from '../controllers/streamController.js';

const router = Router();

// POST /api/stream/token
router.post('/token', generateStreamToken);

export default router;
