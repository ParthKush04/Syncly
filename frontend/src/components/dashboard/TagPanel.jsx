export default function TagPanel({ title, items, accent = 'cyan' }) {
  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(34,197,94,0.1))] text-emerald-50'
      : 'border-cyan-300/20 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.1))] text-cyan-50';

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,35,0.96),rgba(14,165,233,0.14))] p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
          {items.length} items
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {items.map((item) => (
          <span key={item} className={`rounded-full border px-4 py-2 text-sm font-medium ${accentClasses}`}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
