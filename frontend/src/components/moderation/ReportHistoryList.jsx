export default function ReportHistoryList({ reports = [] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Report history</h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {reports.length} entries
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No reports yet.
          </div>
        ) : (
          reports.map((report) => (
            <article key={report._id || report.sessionId || report.reason} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{report.reason}</p>
                  <p className="mt-1 text-sm text-slate-500">Reported user: {report.reportedUser?.fullName || report.reportedUser}</p>
                </div>
                <span className="w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {report.status}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">
                {new Date(report.createdAt || Date.now()).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}