export default function RecentMatches({ matches = [] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent matches</h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {matches.length} items
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No recent matches yet. Join matchmaking to build your network.
          </div>
        ) : (
          matches.map((match) => (
            <article key={match.id || match.fullName} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {match.photoUrl ? (
                  <img
                    src={match.photoUrl}
                    alt={match.fullName}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                    {match.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{match.fullName}</p>
                  <p className="truncate text-sm text-slate-500">
                    {match.profession}
                    {match.company ? ` · ${match.company}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Matched {new Date(match.matchedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                {match.sessionType}
                {match.duration ? ` · ${match.duration}m` : ''}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
