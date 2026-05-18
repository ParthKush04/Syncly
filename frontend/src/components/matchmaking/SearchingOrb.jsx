export default function SearchingOrb() {
  return (
    <div className="relative grid h-64 w-64 place-items-center sm:h-80 sm:w-80">
      <div className="absolute inset-0 rounded-full bg-cyan-100 blur-3xl" />
      <div className="absolute inset-6 rounded-full border border-cyan-200 bg-cyan-50" />
      <div className="absolute inset-12 rounded-full border border-slate-200 bg-white/90" />

      <div className="absolute h-40 w-40 animate-pulse rounded-full border border-cyan-200 bg-gradient-to-br from-cyan-200/70 via-blue-200/45 to-transparent" />

      <div className="relative z-10 grid place-items-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-2xl shadow-cyan-300/30" />
        <div className="mt-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Searching</p>
          <p className="mt-2 text-sm text-slate-600">Finding a high-fit professional match</p>
        </div>
      </div>

      <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cyan-300/60" />
    </div>
  );
}
