import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/branding/Logo.jsx';
import SearchingOrb from '../components/matchmaking/SearchingOrb.jsx';
import StatusCard from '../components/matchmaking/StatusCard.jsx';
import PreferenceChip from '../components/matchmaking/PreferenceChip.jsx';
import { createMatchmakingSocket } from '../services/socketService.js';

const preferenceItems = [
  { label: 'Interests', value: 'Product, AI, Founder growth' },
  { label: 'Goals', value: 'Meet cofounders, investors, operators' },
  { label: 'Experience', value: 'Senior to executive' },
  { label: 'Availability', value: 'Now' }
];

const progressMessages = [
  'Scanning verified profiles...',
  'Comparing interests and networking goals...',
  'Ranking experience alignment...',
  'Preparing your best match...'
];

export default function MatchmakingWaitPage() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const hasMountedRef = useRef(false);
  const timeoutRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(18);
  const [statusMessage, setStatusMessage] = useState('Connecting to matchmaking...');
  const [queueSize, setQueueSize] = useState(null);
  const [matchPartner, setMatchPartner] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % progressMessages.length);
      setProgress((current) => Math.min(96, current + 12));
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('synclyToken');

    if (!token) {
      setErrorMessage('Please sign in again before entering matchmaking.');
      setStatusMessage('Authentication required');
      return undefined;
    }

    const socket = createMatchmakingSocket(token);
    socketRef.current = socket;
    hasMountedRef.current = true;
      const navigateOnceRef = { current: false };

    socket.on('connect', () => {
      console.log('[matchmaking] socket connected', socket.id);
      setStatusMessage('Connected to matchmaking queue');
      console.log('[matchmaking] emitting matchmaking:join');
      socket.emit('matchmaking:join');
    });

    socket.on('connect_error', (error) => {
      console.error('[matchmaking] socket connect_error', error);
      setErrorMessage(error?.message || 'Failed to connect to matchmaking');
      setStatusMessage('Connection error');
    });

    socket.on('matchmaking:queued', (payload) => {
      console.log('[matchmaking] queued payload', payload);
      setStatusMessage(payload?.message || 'You joined the matchmaking queue');
      setQueueSize(payload?.queueSize ?? null);
    });

    socket.on('matchmaking:matched', (payload) => {
      console.log('[matchmaking] matched payload', payload);
      setStatusMessage('Match found');
      setMatchPartner(payload?.partner || null);
      const sessionId = payload?.sessionId || payload?.roomId;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (sessionId && !navigateOnceRef.current) {
        navigateOnceRef.current = true;
        timeoutRef.current = window.setTimeout(() => {
          navigate(`/call?sessionId=${encodeURIComponent(sessionId)}`);
        }, 800);
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        if (!navigateOnceRef.current) {
          navigate('/call');
        }
      }, 1200);
    });

    // New: listen for explicit 'match-found' events from the server and redirect to the shared video room
    socket.on('match-found', (payload) => {
      console.log('[matchmaking] received match-found payload', payload);
      setStatusMessage('Match found');
      setMatchPartner(payload?.partner || null);
      const sessionId = payload?.sessionId || payload?.roomId;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (sessionId && !navigateOnceRef.current) {
        navigateOnceRef.current = true;
        timeoutRef.current = window.setTimeout(() => {
          navigate(`/call?sessionId=${encodeURIComponent(sessionId)}`);
        }, 500);
      }
    });

    socket.on('matchmaking:error', (payload) => {
      console.error('[matchmaking] matchmaking:error', payload);
      setErrorMessage(payload?.message || 'Unable to join matchmaking');
      setStatusMessage('Queue error');
    });

    socket.on('disconnect', () => {
      console.log('[matchmaking] socket disconnected');
      if (hasMountedRef.current && !matchPartner) {
        setStatusMessage('Disconnected from queue');
      }
    });

    return () => {
      hasMountedRef.current = false;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (socket.connected) {
        socket.emit('matchmaking:leave');
      }

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [navigate]);

  useEffect(() => {
    if (!matchPartner) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/call');
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [matchPartner, navigate]);

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8">
          <Logo compact className="mb-5" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Matchmaking queue</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">We’re finding a great connection</h1>
            </div>

            <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Active
            </div>
          </div>

          <div className="mt-8 grid place-items-center rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <SearchingOrb />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
              <span>{errorMessage || statusMessage || progressMessages[messageIndex]}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            {queueSize !== null ? <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">Queue size: {queueSize}</p> : null}
            {matchPartner ? <p className="mt-3 text-sm font-medium text-emerald-700">Matched with {matchPartner?.fullName || 'a professional'}</p> : null}
          </div>
        </section>

        <aside className="grid gap-6 self-start">
          <StatusCard
            title="User status"
            value="Searching for a match"
            description="Your profile is live in the queue and being compared with professionals who share your goals and interests."
          />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Matching preferences</h2>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">Smart filter</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {preferenceItems.map((item) => (
                <PreferenceChip key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-2xl shadow-slate-200/80">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Queue controls</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Ready to stop searching?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              You can leave the matchmaking queue at any time and return when you’re ready to connect again.
            </p>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Cancel matchmaking
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
