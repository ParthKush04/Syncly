import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import authRoutes from './authRoutes.js';
import callRoutes from './callRoutes.js';
import moderationRoutes from './moderationRoutes.js';
import ratingRoutes from './ratingRoutes.js';
import userRoutes from './userRoutes.js';
import streamRoutes from './streamRoutes.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/call', callRoutes);
router.use('/moderation', moderationRoutes);
router.use('/ratings', ratingRoutes);
router.use('/user', userRoutes);
router.use('/stream', streamRoutes);

export default router;
