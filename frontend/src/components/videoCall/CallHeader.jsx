import Logo from '../branding/Logo.jsx';

export default function CallHeader({ sessionTime, connectionStatus = 'Connected', roomName = 'Private networking room' }) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/80 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <Logo compact className="mb-4" />
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">One-on-one video call</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{roomName}</h1>
        <p className="mt-2 text-sm text-slate-500">Premium communication layout for focused, high-trust conversations.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {connectionStatus}
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
          {sessionTime}
        </div>
      </div>
    </header>
  );
}
