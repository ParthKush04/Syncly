export default function CallControls({ onSkip, onLeave, isBusy = false }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/80 backdrop-blur-xl sm:p-5">
      <button
        type="button"
        onClick={onSkip}
        disabled={isBusy}
        className="inline-flex items-center justify-center rounded-full border border-cyan-200 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? 'Processing...' : 'Skip'}
      </button>
      <button
        type="button"
        onClick={onLeave}
        disabled={isBusy}
        className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Leave call
      </button>
    </div>
  );
}
