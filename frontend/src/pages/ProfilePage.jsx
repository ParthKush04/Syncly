import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import ProfileCard from '../components/dashboard/ProfileCard.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
import UserAvatar from '../components/dashboard/UserAvatar.jsx';
import { getDashboardData } from '../services/dashboardService.js';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data = await getDashboardData();

        if (mounted && data?.user) {
          const normalizedUser = {
            ...data.user,
            photoUrl: data.user.profileImage || data.user.photoUrl || ''
          };

          setUser(normalizedUser);
          setSummary(data.summary || null);
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
                photoUrl: parsedUser.profileImage || parsedUser.photoUrl || ''
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

    loadProfile();

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
      navigate('/login', { replace: true });
    }
  };

  return (
    <main className="min-h-screen px-4 py-4 text-slate-900 sm:px-6 lg:px-10 lg:py-6">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.94)),radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_26%)]" />

      <div className="mx-auto grid max-w-7xl gap-6">
        <DashboardNavbar user={user || {}} onSignOut={handleSignOut} />

        <section className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(8,15,35,0.98),rgba(15,23,42,0.92)_55%,rgba(14,165,233,0.75))] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {loading ? (
                <div className="h-20 w-20 animate-pulse rounded-[1.75rem] bg-white/10" />
              ) : (
                <UserAvatar
                  fullName={user?.fullName}
                  photoUrl={user?.photoUrl}
                  sizeClassName="h-20 w-20"
                  fallbackGradient="from-cyan-300 to-blue-500"
                  imageClassName="shadow-[0_16px_40px_rgba(15,23,42,0.35)]"
                />
              )}

              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Profile</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {loading ? 'Loading profile...' : user?.fullName || 'Your profile'}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Your identity, reputation, and networking preferences are collected here in a clean profile view.
                </p>
              </div>
            </div>
          </div>
        </section>

        {user ? <ProfileCard user={user} summary={summary} /> : null}

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <TagPanel title="Interests" items={user?.interests || []} accent="cyan" />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Networking goals</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Goals that guide your matches</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {(user?.networkingGoals || []).length > 0 ? (
                user.networkingGoals.map((goal) => (
                  <span key={goal} className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    {goal}
                  </span>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Add a few goals to make matching more focused.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/matchmaking')}
                className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full bg-slate-900 px-6 text-base font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:scale-[1.01] hover:bg-slate-700"
              >
                Start matchmaking
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                Back to dashboard
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
