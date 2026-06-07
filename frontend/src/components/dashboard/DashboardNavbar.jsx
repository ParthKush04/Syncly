import { Link, useLocation } from 'react-router-dom';
import Logo from '../branding/Logo.jsx';
import UserAvatar from './UserAvatar.jsx';

function getLinkedInPhotoUrl(user) {
  return user?.authProvider === 'linkedin' ? String(user?.profileImage || user?.photoUrl || '').trim() : '';
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' }
];

export default function DashboardNavbar({ user, onSignOut }) {
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-[#0a0f15]/90 backdrop-blur-2xl">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/dashboard" className="text-white">
            <Logo tone="light" />
          </Link>

          <div className="hidden h-10 w-px bg-white/10 lg:block" />

          <nav className="hidden flex-wrap items-center gap-2 lg:flex">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-2.5 py-2 shadow-sm transition hover:border-white/20 hover:bg-white/12 sm:gap-3 sm:px-3"
          >
            <UserAvatar
              fullName={user?.fullName}
              photoUrl={getLinkedInPhotoUrl(user)}
              sizeClassName="h-8 w-8 sm:h-9 sm:w-9"
            />
            <span className="hidden max-w-28 truncate text-sm font-medium text-white sm:inline">{user?.fullName || 'Profile'}</span>
          </Link>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:px-4 sm:py-2.5"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}