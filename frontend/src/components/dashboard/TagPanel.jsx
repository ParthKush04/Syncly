export default function TagPanel({ title, items, accent = 'cyan' }) {
  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-300/20 bg-[#0f2f24] text-emerald-300'
      : 'border-cyan-300/20 bg-[#071428] text-cyan-200';

  return (
    <section className="rounded-[2rem] border border-white/10 card-matte p-6 text-white shadow-2xl shadow-black/20">
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
