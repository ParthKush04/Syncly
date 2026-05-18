import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import {
  adminReviewReport,
  adminSuspendUser,
  getAdminReports,
  getMyReportHistory,
  submitReport
} from '../controllers/moderationController.js';

const router = Router();

router.post('/report', protect, submitReport);
router.get('/history', protect, getMyReportHistory);

router.get('/admin/reports', protect, requireRole('admin'), getAdminReports);
router.patch('/admin/reports/review', protect, requireRole('admin'), adminReviewReport);
router.patch('/admin/users/suspend', protect, requireRole('admin'), adminSuspendUser);

export default router;