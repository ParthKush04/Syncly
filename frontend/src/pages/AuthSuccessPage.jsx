import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthSuccessPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Finalizing sign in...');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function finalizeAuth() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Unable to confirm your session. Please sign in again.');
        }

        const data = await response.json();

        if (!mounted) {
          return;
        }

        setStatus('Sign in complete. Redirecting to your dashboard...');

        if (data?.token) {
          localStorage.setItem('synclyToken', data.token);
        }

        if (data?.user) {
          localStorage.setItem('synclyUser', JSON.stringify(data.user));
        }

        window.setTimeout(() => {
          if (mounted) {
            navigate('/dashboard', { replace: true });
          }
        }, 900);
      } catch (authError) {
        if (!mounted) {
          return;
        }

        setError(authError instanceof Error ? authError.message : 'Sign in failed');
        setStatus('');
      }
    }

    finalizeAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-slate-900">
      <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200/80">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-200/70">
          <span className="text-xl font-semibold">S</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Signing you in</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{status || error}</p>
        {error ? <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      </div>
    </main>
  );
}
