export default function ReportHistoryList({ reports = [] }) {
  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-lg shadow-black/25 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Report history</h3>
        <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/65">
          {reports.length} entries
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/8 p-6 text-sm text-white/65">
            No reports yet.
          </div>
        ) : (
          reports.map((report) => (
            <article key={report._id || report.sessionId || report.reason} className="rounded-2xl border border-white/12 bg-white/8 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{report.reason}</p>
                  <p className="mt-1 text-sm text-white/65">Reported user: {report.reportedUser?.fullName || report.reportedUser}</p>
                </div>
                <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {report.status}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">
                {new Date(report.createdAt || Date.now()).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}