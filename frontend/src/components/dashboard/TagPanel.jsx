import { useEffect, useState } from 'react';

export default function TagPanel({ title, items, accent = 'cyan', onAddItem }) {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft('');
  }, [items.length]);

  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-300/20 bg-[#0f2f24] text-emerald-300'
      : 'border-cyan-300/20 bg-[#071428] text-cyan-200';

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = draft.trim();

    if (!value || !onAddItem) {
      return;
    }

    onAddItem(value);
    setDraft('');
  };

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

      {onAddItem ? (
        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a new interest"
            className="min-h-14 flex-1 rounded-full border border-white/12 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/45"
          />
          <button
            type="submit"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Add interest
          </button>
        </form>
      ) : null}
    </section>
  );
}
