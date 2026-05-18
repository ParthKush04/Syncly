export default function CallControls({ isMuted, isCameraOff, onToggleMute, onToggleCamera, onLeave }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/80 backdrop-blur-xl sm:p-5">
      <ControlButton active={!isMuted} onClick={onToggleMute} label={isMuted ? 'Unmute' : 'Mute'} />
      <ControlButton active={!isCameraOff} onClick={onToggleCamera} label={isCameraOff ? 'Camera on' : 'Camera off'} />
      <button
        type="button"
        onClick={onLeave}
        className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
      >
        Leave call
      </button>
    </div>
  );
}

function ControlButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition ${
        active
          ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          : 'border-cyan-200 bg-cyan-500 text-white hover:bg-cyan-400'
      }`}
    >
      {label}
    </button>
  );
}
