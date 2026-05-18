export default function TagPanel({ title, items, accent = 'cyan' }) {
  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
      : 'border-cyan-100 bg-cyan-50 text-cyan-700';

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
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
