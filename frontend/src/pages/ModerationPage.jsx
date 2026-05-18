import { useEffect, useState } from 'react';
import Logo from '../components/branding/Logo.jsx';
import ReportModal from '../components/moderation/ReportModal.jsx';
import ReportHistoryList from '../components/moderation/ReportHistoryList.jsx';
import { getReportHistory } from '../services/moderationService.js';

export default function ModerationPage() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const data = await getReportHistory();
        if (mounted) {
          setReports(data.reports || []);
        }
      } catch (error) {
        if (mounted) {
          setReports([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
          <Logo compact className="mb-5" />
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Reporting system</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Report users and review moderation history</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Use private reports to flag concerns, then review the history of reports you have filed or received.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Report a user
            </button>
            <a
              href="/admin/moderation"
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Admin dashboard
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
            <h2 className="text-lg font-semibold text-slate-900">How reporting works</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <InfoBlock title="1. Submit a report" text="Describe the issue clearly and submit it privately to moderation." />
              <InfoBlock title="2. Review history" text="Track reports you have submitted and any moderation status changes." />
              <InfoBlock title="3. Admin action" text="Admins can review, resolve, dismiss, or suspend users based on evidence." />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-2xl shadow-slate-200/80">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Report CTA</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Flag a bad interaction before it escalates</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your report helps keep the network professional, safe, and aligned with the platform’s standards.
              </p>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Open report modal
              </button>
            </div>

            <ReportHistoryList reports={loading ? [] : reports} />
          </div>
        </section>
      </div>

      <ReportModal open={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </main>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-slate-500">{text}</p>
    </div>
  );
}
