import Logo from '../branding/Logo.jsx';

export default function CallHeader({ sessionTime, connectionStatus = 'Connected', roomName = 'Private networking room' }) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-lg shadow-black/25 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <Logo compact className="mb-4" />
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">One-on-one video call</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{roomName}</h1>
        <p className="mt-2 text-sm text-white/70">Premium communication layout for focused, high-trust conversations.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100">
          {connectionStatus}
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
          {sessionTime}
        </div>
      </div>
    </header>
  );
}
