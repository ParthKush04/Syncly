export default function SearchingOrb() {
  return (
    <div className="relative grid h-72 w-72 place-items-center sm:h-96 sm:w-96">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.14),transparent_62%)] blur-2xl" />
      <div className="absolute inset-2 rounded-full border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(34,211,238,0.12)]" />
      <div className="absolute inset-8 rounded-full border border-dashed border-cyan-300/50 animate-spin-slow" />
      <div className="absolute inset-14 rounded-full border border-dashed border-fuchsia-300/35 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '16s' }} />
      <div className="absolute inset-20 rounded-full border border-white/8 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(249,115,22,0.1),rgba(236,72,153,0.14),rgba(168,85,247,0.14))] animate-sheen" />

      <div className="absolute h-44 w-44 animate-pulse rounded-full border border-cyan-200/35 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.52),rgba(59,130,246,0.2),transparent_72%)] shadow-[0_0_90px_rgba(56,189,248,0.32)]" />
      <div className="absolute h-56 w-56 rounded-full border border-white/10 animate-float-soft" />
      <div className="absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.95)] animate-pulse" />
      <div className="absolute right-10 top-16 h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_20px_rgba(253,186,116,0.95)] animate-pulse" style={{ animationDelay: '350ms' }} />
      <div className="absolute bottom-14 left-12 h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_20px_rgba(244,114,182,0.95)] animate-pulse" style={{ animationDelay: '700ms' }} />

      <div className="relative z-10 grid place-items-center text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-white/10 shadow-2xl shadow-cyan-300/20 backdrop-blur-xl">
          <div className="h-16 w-16 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(59,130,246,0.85)_55%,rgba(14,165,233,0.1)_100%)] shadow-[0_0_40px_rgba(56,189,248,0.45)] animate-float-soft" />
        </div>
        <div className="mt-5 max-w-[14rem]">
          <p className="text-sm uppercase tracking-[0.45em] text-white">Searching</p>
          <p className="mt-2 text-sm text-white/75">Finding a high-fit professional match</p>
        </div>
      </div>
    </div>
  );
}
