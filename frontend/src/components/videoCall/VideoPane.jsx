export default function VideoPane({ title, subtitle, accent = 'cyan', isLocal = false }) {
  const accentClasses =
    accent === 'emerald'
      ? 'from-emerald-100 via-emerald-50 to-transparent border-emerald-200'
      : 'from-cyan-100 via-cyan-50 to-transparent border-cyan-200';

  return (
    <section className="relative min-h-[280px] overflow-hidden rounded-[2rem] border border-white/12 card-matte p-4 shadow-2xl shadow-black/25 sm:min-h-[360px]">

      <div className="relative flex h-full min-h-[250px] flex-col justify-between rounded-[1.6rem] border border-white/12 bg-white/6 p-4 sm:min-h-[320px] sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{isLocal ? 'You' : 'Remote participant'}</p>
            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{title}</h2>
            <p className="mt-1 text-sm text-white/65">{subtitle}</p>
          </div>

          <div className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            {isLocal ? 'Local video' : 'Remote video'}
          </div>
        </div>

        <div className="relative mt-6 flex flex-1 items-center justify-center">
          <div className="absolute h-44 w-44 rounded-full bg-white/2 blur-3xl animate-float-soft" />
          <div className="absolute h-28 w-28 rounded-full bg-white/2 blur-2xl animate-drift-slow" />

          <div className="relative grid place-items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-white/12 card-matte shadow-2xl shadow-black/20 sm:h-36 sm:w-36">
              <div className="grid h-20 w-20 place-items-center rounded-[1.25rem] accent-solid text-lg font-semibold text-white shadow-sm sm:h-24 sm:w-24 sm:text-xl">
                {isLocal ? 'ME' : 'AV'}
              </div>
            </div>

            <div className="mt-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-medium text-white/75 shadow-sm">
              Camera stream placeholder
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-white/65">
          <span>{isLocal ? 'Microphone active' : 'Remote participant speaking'}</span>
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">Live</span>
        </div>
      </div>
    </section>
  );
}
