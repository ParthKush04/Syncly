import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
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
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-matte" />
      <div className="mx-auto grid max-w-7xl gap-6">
        <DashboardNavbar user={user || {}} onSignOut={handleSignOut} />
        <section className="overflow-hidden rounded-[2.5rem] border border-white/12 card-matte shadow-2xl shadow-black/25">
          <div className="grid gap-6 px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {loading ? 'Loading your dashboard...' : `Welcome back, ${user?.fullName || 'user'}`}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
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

            <TagPanel title="Interests" items={user?.interests || []} accent="cyan" />
          </div>

          <RecentMatches matches={recentMatches} />
        </section>
      </div>
    </main>
  );
}

function StatPill({ label, value, dark = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-left shadow-sm ${dark ? 'border-white/10 bg-white/10 backdrop-blur-md' : 'border-white/10 bg-white/8'}`}>
      <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-cyan-100/80' : 'text-white/65'}`}>{label}</p>
      <p className={`mt-2 text-lg font-semibold text-white`}>{value}</p>
    </div>
  );
}
