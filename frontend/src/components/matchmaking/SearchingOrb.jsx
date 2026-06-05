export default function SearchingOrb() {
  return (
    <div className="relative grid h-72 w-72 place-items-center sm:h-96 sm:w-96">
      <div className="absolute inset-0 rounded-full bg-white/2 blur-2xl" />
      <div className="absolute inset-2 rounded-full border border-white/8 bg-white/4 shadow-[0_0_40px_rgba(0,0,0,0.35)]" />
      <div className="absolute inset-8 rounded-full border border-dashed border-cyan-300/50 animate-spin-slow" />
      <div className="absolute inset-14 rounded-full border border-dashed border-fuchsia-300/35 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '16s' }} />
      <div className="absolute inset-20 rounded-full border border-white/6 bg-white/6" />

      <div className="absolute h-44 w-44 animate-pulse rounded-full border border-white/10 bg-white/6 shadow-[0_0_40px_rgba(0,0,0,0.45)]" />
      <div className="absolute h-56 w-56 rounded-full border border-white/10 animate-float-soft" />
      <div className="absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.95)] animate-pulse" />
      <div className="absolute right-10 top-16 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(165,243,252,0.95)] animate-pulse" style={{ animationDelay: '350ms' }} />
        <div className="absolute right-10 top-16 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(165,243,252,0.95)] animate-pulse" style={{ animationDelay: '350ms' }} />
      <div className="absolute bottom-14 left-12 h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_20px_rgba(244,114,182,0.95)] animate-pulse" style={{ animationDelay: '700ms' }} />

      <div className="relative z-10 grid place-items-center text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-white/12 card-matte shadow-2xl backdrop-blur-xl">
          <div className="h-16 w-16 rounded-full avatar-fallback shadow-[0_0_20px_rgba(0,0,0,0.45)] animate-float-soft" />
        </div>
        <div className="mt-5 max-w-[14rem]">
          <p className="text-sm uppercase tracking-[0.45em] text-white">Searching</p>
          <p className="mt-2 text-sm text-white/75">Finding a high-fit professional match</p>
        </div>
      </div>
    </div>
  );
}
