import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import ProfileCard from '../components/dashboard/ProfileCard.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
import { getDashboardData } from '../services/dashboardService.js';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

        {user ? <ProfileCard user={user} /> : null}

        <section className="grid gap-6 lg:grid-cols-1">
          <TagPanel title="Interests" items={user?.interests || []} accent="cyan" />
        </section>
      </div>
    </main>
  );
}
