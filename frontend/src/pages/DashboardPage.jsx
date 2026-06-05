import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
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
  const [matching, setMatching] = useState(false);
  const [connected, setConnected] = useState(false);

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
        {/* Top matchmaking area: two large matte screens and start button */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/12 card-matte p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Matchmaking</p>
                  <p className="mt-1 text-sm text-white/75">Start a quick match to connect with another professional.</p>
                </div>
                <div>
                  {/* Start matchmaking button: shows white text on matte */}
                  <StartMatchButton onStart={() => {
                    setMatching(true);
                    setConnected(false);
                    setTimeout(() => {
                      setConnected(true);
                      setMatching(false);
                    }, 1400);
                  }} matching={matching} connected={connected} />
                </div>
              </div>

              <TwoScreenPreview user={user} connected={connected} matching={matching} />
            </div>

            <TagPanel title="Interests" items={user?.interests || []} accent="cyan" />
          </div>

          <RecentMatches matches={recentMatches} />
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

function StartMatchButton({ onStart, matching, connected }) {
  return (
    <button
      type="button"
      onClick={onStart}
      disabled={matching || connected}
      className={`inline-flex min-h-14 items-center justify-center rounded-full px-6 py-3.5 text-base font-semibold transition ${connected ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white'} ${matching ? 'opacity-80 cursor-wait' : ''}`}
    >
      {matching ? 'Matching...' : connected ? 'Connected' : 'Start matchmaking'}
    </button>
  );
}

function TwoScreenPreview({ user, connected, matching }) {
  const otherName = 'Other User';

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-[1.5rem] border border-white/10 bg-white/5 h-56 md:h-80 flex flex-col items-center justify-center text-white"
        >
          {connected ? (
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-white/5 text-white grid place-items-center text-xl font-semibold mb-3">
                {i === 0 ? (user?.fullName?.split(' ').map(n => n[0]).slice(0,2).join('') || 'U') : 'O'}
              </div>
              <div className="text-sm font-semibold">{i === 0 ? (user?.fullName || 'You') : otherName}</div>
            </div>
          ) : (
            <div className="text-center text-white/60">{matching ? 'Connecting…' : 'Waiting for match'}</div>
          )}
        </div>
      ))}
    </div>
  );
}
