import {
  createReport,
  getAdminReportOverview,
  getPendingReports,
  getReportHistoryForUser,
  reviewReport,
  suspendUser
} from '../services/moderationService.js';

export async function submitReport(req, res, next) {
  try {
    const { reportedUserId, reason } = req.body || {};

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: 'reportedUserId and reason are required' });
    }

    const report = await createReport({
      reportedUserId,
      reportedById: req.user._id,
      reason
    });

    return res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    return next(error);
  }
}

export async function getMyReportHistory(req, res, next) {
  try {
    const reports = await getReportHistoryForUser(req.user._id);
    return res.json({ reports });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminReports(req, res, next) {
  try {
    const [overview, reports] = await Promise.all([getAdminReportOverview(), getPendingReports()]);
    return res.json({ overview, reports });
  } catch (error) {
    return next(error);
  }
}

export async function adminReviewReport(req, res, next) {
  try {
    const { reportId, status, adminNotes } = req.body || {};

    if (!reportId || !status) {
      return res.status(400).json({ message: 'reportId and status are required' });
    }

    const report = await reviewReport({
      reportId,
      status,
      adminId: req.user._id,
      adminNotes
    });

    return res.json({ message: 'Report reviewed successfully', report });
  } catch (error) {
    return next(error);
  }
}

export async function adminSuspendUser(req, res, next) {
  try {
    const { userId, reason, days } = req.body || {};

    if (!userId || !reason) {
      return res.status(400).json({ message: 'userId and reason are required' });
    }

    const user = await suspendUser({ userId, reason, days });

    return res.json({
      message: 'User suspended successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        isSuspended: user.isSuspended,
        suspendedUntil: user.suspendedUntil,
        suspensionReason: user.suspensionReason
      }
    });
  } catch (error) {
    return next(error);
  }
}
