export default function RecentMatches({ matches = [] }) {
  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-lg shadow-black/25 backdrop-blur-2xl lg:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-white sm:text-lg">Recent matches</h3>
        <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] text-white/65">
          {matches.length} items
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/8 p-4 text-sm text-white/65">
            No recent matches yet. Join matchmaking to build your network.
          </div>
        ) : (
          matches.map((match) => (
            <article key={match.id || match.fullName} className="flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/8 p-3">
              <div className="flex min-w-0 items-center gap-3">
                {match.photoUrl ? (
                  <img
                    src={match.photoUrl}
                    alt={match.fullName}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-xs font-semibold text-white">
                    {match.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{match.fullName}</p>
                  <p className="truncate text-xs text-white/65">
                    {match.profession}
                    {match.company ? ` · ${match.company}` : ''}
                  </p>
                  <p className="mt-1 text-[11px] text-white/45">Matched {new Date(match.matchedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">
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
