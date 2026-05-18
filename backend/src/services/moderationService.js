import Report from '../models/Report.js';
import User from '../models/User.js';

function calculateSuspensionDuration(reportCount) {
  if (reportCount >= 10) return 30;
  if (reportCount >= 5) return 7;
  if (reportCount >= 3) return 3;
  return 0;
}

export async function createReport({ reportedUserId, reportedById, reason }) {
  const reportedUser = await User.findById(reportedUserId).select('_id role isSuspended');

  if (!reportedUser) {
    throw new Error('Reported user not found');
  }

  if (String(reportedUser._id) === String(reportedById)) {
    throw new Error('You cannot report yourself');
  }

  const report = await Report.create({
    reportedUser: reportedUserId,
    reportedBy: reportedById,
    reason: String(reason || '').trim(),
    status: 'pending'
  });

  return report;
}

export async function getReportHistoryForUser(userId) {
  return Report.find({ $or: [{ reportedBy: userId }, { reportedUser: userId }] })
    .populate('reportedUser reportedBy', 'fullName email profileImage role isSuspended')
    .sort({ createdAt: -1 });
}

export async function getPendingReports() {
  return Report.find({ status: 'pending' })
    .populate('reportedUser reportedBy', 'fullName email profileImage role isSuspended reputationScore')
    .sort({ createdAt: -1 });
}

export async function reviewReport({ reportId, status, adminId, adminNotes = '' }) {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new Error('Report not found');
  }

  report.status = status;
  if (adminNotes) {
    report.adminNotes = adminNotes;
  }
  report.reviewedBy = adminId;
  report.reviewedAt = new Date();

  await report.save();

  return report.populate('reportedUser reportedBy reviewedBy', 'fullName email profileImage role reputationScore');
}

export async function suspendUser({ userId, reason, days = 0 }) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const suspensionDays = Number(days) || calculateSuspensionDuration(user.reportCount || 0);
  const suspendedUntil = suspensionDays > 0 ? new Date(Date.now() + suspensionDays * 24 * 60 * 60 * 1000) : null;

  user.isSuspended = true;
  user.suspendedUntil = suspendedUntil;
  user.suspensionReason = String(reason || '').trim();

  await user.save();
  return user;
}

export async function getAdminReportOverview() {
  const [pendingCount, reviewedCount, resolvedCount, dismissedCount, suspendedUsers] = await Promise.all([
    Report.countDocuments({ status: 'pending' }),
    Report.countDocuments({ status: 'reviewed' }),
    Report.countDocuments({ status: 'resolved' }),
    Report.countDocuments({ status: 'dismissed' }),
    User.countDocuments({ isSuspended: true })
  ]);

  return {
    pendingCount,
    reviewedCount,
    resolvedCount,
    dismissedCount,
    suspendedUsers
  };
}