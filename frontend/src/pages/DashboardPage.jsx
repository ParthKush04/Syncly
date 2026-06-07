import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboardService.js';

function getLinkedInPhotoUrl(user) {
  return user?.authProvider === 'linkedin' ? String(user?.profileImage || user?.photoUrl || '').trim() : '';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const data = await getDashboardData();

        if (mounted && data?.user) {
          const normalizedUser = {
            ...data.user,
            photoUrl: getLinkedInPhotoUrl(data.user)
          };

          setUser(normalizedUser);
          localStorage.setItem('synclyUser', JSON.stringify(normalizedUser));
        }
      } catch {
        if (mounted) {
          const savedUser = localStorage.getItem('synclyUser');

          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser({
                ...parsedUser,
                photoUrl: getLinkedInPhotoUrl(parsedUser)
              });
            } catch {
              setUser(null);
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://syncly-3nm4.onrender.com'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      localStorage.removeItem('synclyToken');
      localStorage.removeItem('synclyUser');
      navigate('/', { replace: true });
    }
  };

  const handleStart = () => {
    navigate('/matchmaking');
  };

  const handleAddInterest = (value) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const existingInterests = currentUser.interests || [];

      if (existingInterests.some((item) => item.toLowerCase() === value.toLowerCase())) {
        return currentUser;
      }

      const nextUser = {
        ...currentUser,
        interests: [...existingInterests, value]
      };

      localStorage.setItem('synclyUser', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <main className="min-h-screen px-4 pb-6 pt-24 text-white sm:px-6 lg:px-10 lg:pt-28 lg:pb-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-matte" />
      <div className="mx-auto grid max-w-7xl gap-6">
        <DashboardNavbar user={user || {}} onSignOut={handleSignOut} />
        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-white/12 card-matte p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Matchmaking</p>
                <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">
                  Connect only when a real matched user is available. No placeholder profiles, no fake matches.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <StartMatchButton onStart={handleStart} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#05080d] px-6 text-center text-white/75">
                <p className="text-lg font-medium">Start matchmaking to connect with real users.</p>
              </div>

              <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#05080d]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Waiting for a real user</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">No match yet</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">Real only</span>
                </div>
                <div className="grid flex-1 place-items-center px-6 text-center text-white/60">
                  <div>
                    <p className="text-base font-medium text-white/75">You will only connect once another verified user is also in the matchmaking queue.</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">If no user is available yet, we keep searching and do not connect until the match is real.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TagPanel
            title="Interests"
            items={user?.interests || []}
            accent="cyan"
            onAddItem={handleAddInterest}
          />
        </section>
      </div>
    </main>
  );
}

function StartMatchButton({ onStart }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
    >
      Start matchmaking
    </button>
  );
}

function ActionButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function CameraScreen({ title, subtitle, active, showAvatar = false, avatarUrl = '', avatarLabel = '', children }) {
  return (
    <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1119] md:min-h-[24rem]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">{subtitle}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
          Live
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 items-stretch justify-stretch bg-[#05080d]">
        {active ? (
          <>
            {showAvatar ? <AvatarOverlay avatarUrl={avatarUrl} avatarLabel={avatarLabel} /> : null}
            {children}
          </>
        ) : (
          <div className="grid w-full place-items-center px-6 text-center text-white/60">
            <div>
              <p className="text-base font-medium text-white/75">Blank screen</p>
              <p className="mt-2 text-sm leading-6 text-white/55">This stays blank until you start matchmaking.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarOverlay({ avatarUrl, avatarLabel }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-[#05080d]/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={avatarLabel}
            className="h-24 w-24 rounded-full border border-white/15 object-cover shadow-[0_0_0_8px_rgba(255,255,255,0.04)]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-white/8 text-2xl font-semibold text-white shadow-[0_0_0_8px_rgba(255,255,255,0.04)]">
            {getInitials(avatarLabel)}
          </div>
        )}
        <p className="text-sm font-semibold text-white">{avatarLabel}</p>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) {
    return 'U';
  }

  return String(name)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
