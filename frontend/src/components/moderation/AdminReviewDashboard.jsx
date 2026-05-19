import { useState } from 'react';
import { reviewReport, suspendUser } from '../../services/moderationService.js';

const statusOptions = ['pending', 'reviewed', 'resolved', 'dismissed'];

export default function AdminReviewDashboard({ overview, reports, onRefresh }) {
  const [activeReportId, setActiveReportId] = useState('');
  const [reviewStatus, setReviewStatus] = useState('reviewed');
  const [adminNotes, setAdminNotes] = useState('');
  const [userId, setUserId] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDays, setSuspendDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReview = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await reviewReport({ reportId: activeReportId, status: reviewStatus, adminNotes });
      setMessage('Report reviewed successfully.');
      await onRefresh?.();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Failed to review report');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await suspendUser({ userId, reason: suspendReason, days: suspendDays });
      setMessage('User suspended successfully.');
      await onRefresh?.();
    } catch (suspendError) {
      setError(suspendError instanceof Error ? suspendError.message : 'Failed to suspend user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">Admin review dashboard</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Moderate reports and suspend users</h2>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          Role: admin
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric label="Pending" value={overview?.pendingCount ?? 0} />
        <Metric label="Reviewed" value={overview?.reviewedCount ?? 0} />
        <Metric label="Resolved" value={overview?.resolvedCount ?? 0} />
        <Metric label="Suspended users" value={overview?.suspendedUsers ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form className="rounded-[1.75rem] border border-white/12 bg-white/8 p-5" onSubmit={handleReview}>
          <h3 className="text-lg font-semibold text-white">Review a report</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm text-white/70">Report ID</span>
              <input value={activeReportId} onChange={(event) => setActiveReportId(event.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="report-id" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Status</span>
              <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400">
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Admin notes</span>
              <input value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="Optional notes" />
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={loading} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Saving...' : 'Save review'}
            </button>
          </div>
        </form>

        <form className="rounded-[1.75rem] border border-white/12 bg-white/8 p-5" onSubmit={handleSuspend}>
          <h3 className="text-lg font-semibold text-white">Suspend a user</h3>

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-white/70">User ID</span>
              <input value={userId} onChange={(event) => setUserId(event.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="user-id" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Reason</span>
              <textarea value={suspendReason} onChange={(event) => setSuspendReason(event.target.value)} rows={4} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="Why is the user being suspended?" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Days</span>
              <input type="number" min="0" value={suspendDays} onChange={(event) => setSuspendDays(Number(event.target.value))} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={loading} className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Processing...' : 'Suspend user'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 grid gap-3">
        {message ? <p className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-emerald-100">{message}</p> : null}
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-rose-100">{error}</p> : null}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">Pending report queue</h3>
        <div className="mt-4 grid gap-4">
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 bg-white/8 p-6 text-sm text-white/65">
              No pending reports.
            </div>
          ) : (
            reports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{report.reason}</p>
                    <p className="mt-1 text-sm text-white/65">Reported by: {report.reportedBy?.fullName || 'Unknown'}</p>
                    <p className="mt-1 text-sm text-white/65">Reported user: {report.reportedUser?.fullName || 'Unknown'}</p>
                  </div>
                  <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    {report.status}
                  </div>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">
                  {new Date(report.createdAt || Date.now()).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
