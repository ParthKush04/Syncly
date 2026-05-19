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
    <header className="sticky top-3 z-50 mb-4 rounded-[1.75rem] border border-white/12 bg-white/8 px-4 py-3 shadow-lg shadow-black/25 backdrop-blur-2xl sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-white">
            <Logo />
          </Link>

          <div className="hidden h-10 w-px bg-white/10 lg:block" />

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-white/12 text-white shadow-md shadow-black/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
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
            className="hidden items-center gap-3 rounded-full border border-white/12 bg-white/8 px-3 py-2 shadow-sm transition hover:border-white/20 hover:bg-white/12 sm:inline-flex"
          >
            <UserAvatar
              fullName={user?.fullName}
              photoUrl={user?.photoUrl}
              sizeClassName="h-9 w-9"
              fallbackGradient="from-cyan-400 to-blue-500"
            />
            <span className="max-w-28 truncate text-sm font-medium text-white">{user?.fullName || 'Profile'}</span>
          </Link>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}