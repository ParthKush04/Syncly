import { useEffect, useMemo, useState } from 'react';

function Chip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
    >
      <span>{label}</span>
      <span aria-hidden="true">×</span>
    </button>
  );
}

function InterestEditor({ title, placeholder, items, inputValue, setInputValue, onAdd, onRemove, accent = 'cyan' }) {
  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-100 bg-emerald-50 text-emerald-700 focus:border-emerald-300'
      : 'border-cyan-100 bg-cyan-50 text-cyan-700 focus:border-cyan-300';

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-5 shadow-lg shadow-slate-200/80">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Profile editor</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {items.length} items
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className={`min-h-12 flex-1 rounded-full border px-4 text-sm outline-none transition placeholder:text-slate-400 ${accentClasses}`}
        />
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Add a few items to make your profile stronger.
          </div>
        ) : (
          items.map((item) => <Chip key={item} label={item} onRemove={() => onRemove(item)} />)
        )}
      </div>
    </section>
  );
}

export default function ProfileEditorPanel({ user, onSave, saving = false }) {
  const [interests, setInterests] = useState(user.interests || []);
  const [interestValue, setInterestValue] = useState('');

  useEffect(() => {
    setInterests(user.interests || []);
  }, [user.interests]);

  const summary = useMemo(
    () => [
      { label: 'Interests', value: interests.length },
      { label: 'Reputation', value: user.reputationScore ?? 0 }
    ],
    [interests.length, user.reputationScore]
  );

  const addInterest = () => {
    const nextValue = interestValue.trim();
    if (!nextValue || interests.includes(nextValue)) {
      return;
    }
    setInterests((current) => [...current, nextValue]);
    setInterestValue('');
  };

  const handleSubmit = () => {
    onSave?.({ interests });
  };

  return (
    <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Profile setup</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Keep one clean interests list and update it whenever your focus changes.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Add interests here so your profile stays tidy, relevant, and easy for matching to interpret.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <InterestEditor
          title="Interests"
          placeholder="Add an interest, e.g. Product design"
          items={interests}
          inputValue={interestValue}
          setInputValue={setInterestValue}
          onAdd={addInterest}
          onRemove={(item) => setInterests((current) => current.filter((entry) => entry !== item))}
          accent="cyan"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Your edits are saved to your profile so matchmaking and your dashboard stay in sync.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </section>
  );
}
