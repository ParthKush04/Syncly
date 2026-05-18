import { useEffect, useState } from 'react';
import { submitReport } from '../../services/moderationService.js';

export default function ReportModal({ open, onClose, reportedUserId = 'demo-user-id' }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
      setSuccess('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await submitReport({ reportedUserId, reason });
      setSuccess('Report submitted successfully.');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/30 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Report user</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Submit a moderation report</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Share the issue clearly so admins can review quickly.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Reported user ID</span>
            <input
              value={reportedUserId}
              readOnly
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
              placeholder="Explain what happened, what behavior you saw, and why you’re reporting it."
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Private moderation review</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Submit report'}
              </button>
            </div>
          </div>

          {success ? <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</p> : null}
          {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}