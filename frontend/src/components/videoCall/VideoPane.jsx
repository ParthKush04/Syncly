export default function VideoPane({ title, subtitle, accent = 'cyan', isLocal = false }) {
  const accentClasses =
    accent === 'emerald'
      ? 'from-emerald-100 via-emerald-50 to-transparent border-emerald-200'
      : 'from-cyan-100 via-cyan-50 to-transparent border-cyan-200';

  return (
    <section className={`relative min-h-[280px] overflow-hidden rounded-[2rem] border bg-gradient-to-br ${accentClasses} p-4 shadow-2xl shadow-slate-200/80 sm:min-h-[360px]`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_35%)]" />
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_40%)]" />

      <div className="relative flex h-full min-h-[250px] flex-col justify-between rounded-[1.6rem] border border-slate-200 bg-white/90 p-4 sm:min-h-[320px] sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{isLocal ? 'You' : 'Remote participant'}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {isLocal ? 'Local video' : 'Remote video'}
          </div>
        </div>

        <div className="relative mt-6 flex flex-1 items-center justify-center">
          <div className="absolute h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute h-28 w-28 rounded-full bg-blue-500/20 blur-2xl" />

          <div className="relative grid place-items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-2xl shadow-slate-200/80 sm:h-36 sm:w-36">
              <div className="grid h-20 w-20 place-items-center rounded-[1.25rem] bg-slate-900 text-lg font-semibold text-white shadow-sm sm:h-24 sm:w-24 sm:text-xl">
                {isLocal ? 'ME' : 'AV'}
              </div>
            </div>

            <div className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
              Camera stream placeholder
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{isLocal ? 'Microphone active' : 'Remote participant speaking'}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">Live</span>
        </div>
      </div>
    </section>
  );
}
