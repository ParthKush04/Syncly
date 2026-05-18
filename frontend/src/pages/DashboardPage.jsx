import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import MatchmakingPanel from '../components/dashboard/MatchmakingPanel.jsx';
import RecentMatches from '../components/dashboard/RecentMatches.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboardService.js';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const data = await getDashboardData();

        if (mounted && data?.user) {
          const normalizedUser = {
            ...data.user,
            photoUrl: data.user.profileImage || data.user.photoUrl || ''
          };

          setUser(normalizedUser);
          setSummary(data.summary || null);
          setRecentMatches(data.recentMatches || []);
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

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
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
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.94)),radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_24%)]" />
      <div className="mx-auto grid max-w-7xl gap-6">
        <DashboardNavbar user={user || {}} onSignOut={handleSignOut} />
        <section className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(8,15,35,0.98),rgba(15,23,42,0.92)_55%,rgba(14,165,233,0.75))] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {loading ? 'Loading your dashboard...' : `Welcome back, ${user?.fullName || 'user'}`}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                A simple overview of your profile strength, reputation, and matching activity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:justify-self-end">
              <StatPill label="Profile strength" value={`${summary?.profileStrength ?? 0}%`} dark />
              <StatPill label="Reputation" value={`${user?.reputationScore ?? 0}/100`} dark />
              <StatPill label="Matches" value={`${summary?.activeMatches ?? 0}`} dark />
              <StatPill label="Score" value={`${summary?.networkScore ?? user?.reputationScore ?? 0}/100`} dark />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6 self-start">
            <MatchmakingPanel summary={summary} />
          </div>

          <RecentMatches matches={recentMatches} />
        </section>
      </div>
    </main>
  );
}

function StatPill({ label, value, dark = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-left shadow-sm ${dark ? 'border-white/10 bg-white/10 backdrop-blur-md' : 'border-slate-200 bg-slate-50'}`}>
      <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-cyan-100/80' : 'text-slate-500'}`}>{label}</p>
      <p className={`mt-2 text-lg font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}
