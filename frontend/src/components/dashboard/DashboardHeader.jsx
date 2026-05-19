import Logo from '../branding/Logo.jsx';

export default function DashboardHeader({ user, summary }) {
  return (
    <header className="rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-lg shadow-black/25 backdrop-blur-2xl sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Logo compact />
          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-cyan-100">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build meaningful professional connections
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            Track your profile strength, see who you matched with recently, and jump back into networking with one
            click.
          </p>
        </div>

        <div className="grid gap-4 lg:min-w-[18rem]">
          <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 shadow-sm backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100">Signed in as</p>
            <p className="mt-2 truncate text-lg font-semibold text-white">{user?.fullName || 'Syncly user'}</p>
            <p className="truncate text-sm text-white/65">{user?.email || 'Loading profile...'}</p>

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
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-left shadow-sm backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
