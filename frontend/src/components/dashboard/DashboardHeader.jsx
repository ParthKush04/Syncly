import Logo from '../branding/Logo.jsx';

export default function DashboardHeader({ user, summary }) {
  return (
    <header className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/80 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Logo compact />
          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-cyan-700">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Build meaningful professional connections
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Track your profile strength, see who you matched with recently, and jump back into networking with one
            click.
          </p>
        </div>

        <div className="grid gap-4 lg:min-w-[18rem]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-700">Signed in as</p>
            <p className="mt-2 truncate text-lg font-semibold text-slate-900">{user?.fullName || 'Syncly user'}</p>
            <p className="truncate text-sm text-slate-500">{user?.email || 'Loading profile...'}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatPill label="Profile strength" value={`${summary?.profileStrength ?? 0}%`} />
              <StatPill label="Active matches" value={`${summary?.activeMatches ?? 0}`} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
