import { Link, useLocation } from 'react-router-dom';
import Logo from '../branding/Logo.jsx';
import UserAvatar from './UserAvatar.jsx';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Matchmaking', href: '/matchmaking' }
];

export default function DashboardNavbar({ user, onSignOut }) {
  const location = useLocation();

  return (
    <header className="sticky top-3 z-50 mb-4 rounded-[1.75rem] border border-slate-200/70 bg-white/80 px-4 py-3 shadow-lg shadow-slate-200/60 backdrop-blur-xl sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-900">
            <Logo />
          </Link>

          <div className="hidden h-10 w-px bg-slate-200 lg:block" />

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
          >
            <UserAvatar
              fullName={user?.fullName}
              photoUrl={user?.photoUrl}
              sizeClassName="h-9 w-9"
              fallbackGradient="from-cyan-400 to-blue-500"
            />
            <span className="max-w-28 truncate text-sm font-medium text-slate-700">{user?.fullName || 'Profile'}</span>
          </Link>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}