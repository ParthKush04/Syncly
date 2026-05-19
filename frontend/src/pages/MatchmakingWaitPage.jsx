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
  const hasNavigatedToCallRef = useRef(false);
  const hasLeftQueueRef = useRef(false);
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
    const userJson = localStorage.getItem('synclyUser');
    const authUserId = (() => {
      if (!userJson) {
        return '';
      }

      try {
        return String(JSON.parse(userJson)?._id || '').trim();
      } catch {
        return '';
      }
    })();

    console.log('[matchmaking] auth/token readiness', {
      hasToken: Boolean(token),
      authUserId,
      ready: Boolean(token && authUserId)
    });

    if (!token || !authUserId) {
      setErrorMessage('Please sign in again before entering matchmaking.');
      setStatusMessage('Authentication required');
      return undefined;
    }

    hasNavigatedToCallRef.current = false;
    hasLeftQueueRef.current = false;

    const socket = createMatchmakingSocket(token);
    socketRef.current = socket;
    hasMountedRef.current = true;

    const navigateToCall = (sessionId, delayMs = 600) => {
      if (hasNavigatedToCallRef.current) {
        return;
      }

      hasNavigatedToCallRef.current = true;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        const nextUrl = sessionId ? `/call?sessionId=${encodeURIComponent(sessionId)}` : '/call';
        console.log('[matchmaking] navigating to call', { nextUrl });
        navigate(nextUrl);
      }, delayMs);
    };

    const handleConnect = () => {
      console.log('[matchmaking] socket connected', socket.id);
      setStatusMessage('Connected to matchmaking queue');
      console.log('[matchmaking] emitting matchmaking:join');
      socket.emit('matchmaking:join');
    };
    socket.on('connect', handleConnect);

    const handleConnectError = (error) => {
      console.error('[matchmaking] socket connect_error', error);
      setErrorMessage(error?.message || 'Failed to connect to matchmaking');
      setStatusMessage('Connection error');
    };
    socket.on('connect_error', handleConnectError);

    const handleQueued = (payload) => {
      console.log('[matchmaking] queued payload', payload);
      setStatusMessage(payload?.message || 'You joined the matchmaking queue');
      setQueueSize(payload?.queueSize ?? null);
    };
    socket.on('matchmaking:queued', handleQueued);

    const handleMatched = (payload) => {
      console.log('[matchmaking] matched payload', payload);
      setStatusMessage('Match found');
      setMatchPartner(payload?.partner || null);
      const sessionId = payload?.sessionId || payload?.roomId;
      navigateToCall(sessionId, 600);
    };
    socket.on('matchmaking:matched', handleMatched);

    const handleMatchFound = (payload) => {
      console.log('[matchmaking] received match-found payload', payload);
      setStatusMessage('Match found');
      setMatchPartner(payload?.partner || null);
      const sessionId = payload?.sessionId || payload?.roomId;
      navigateToCall(sessionId, 500);
    };
    socket.on('match-found', handleMatchFound);

    const handleMatchmakingError = (payload) => {
      console.error('[matchmaking] matchmaking:error', payload);
      setErrorMessage(payload?.message || 'Unable to join matchmaking');
      setStatusMessage('Queue error');
    };
    socket.on('matchmaking:error', handleMatchmakingError);

    const handleDisconnect = (reason) => {
      console.log('[matchmaking] socket disconnected');
      if (hasMountedRef.current && !hasNavigatedToCallRef.current) {
        setStatusMessage('Disconnected from queue');
      }
      console.log('[matchmaking] disconnect reason', reason);
    };
    socket.on('disconnect', handleDisconnect);

    return () => {
      hasMountedRef.current = false;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (socket.connected && !hasLeftQueueRef.current && !hasNavigatedToCallRef.current) {
        hasLeftQueueRef.current = true;
        console.log('[matchmaking] emitting matchmaking:leave');
        socket.emit('matchmaking:leave');
      }

      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('matchmaking:queued', handleQueued);
      socket.off('matchmaking:matched', handleMatched);
      socket.off('match-found', handleMatchFound);
      socket.off('matchmaking:error', handleMatchmakingError);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rounded-[2rem] card-dark-strong p-6 shadow-2xl shadow-black/30 sm:p-8">
          <Logo compact className="mb-5" tone="light" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Matchmaking queue</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">We’re finding a great connection</h1>
            </div>

            <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Active
            </div>
          </div>

          <div className="mt-8 grid place-items-center rounded-[2rem] card-dark p-6">
            <SearchingOrb />
          </div>

          <div className="mt-6 rounded-3xl card-dark p-5">
            <div className="flex items-center justify-between gap-4 text-sm text-white/80">
              <span>{errorMessage || statusMessage || progressMessages[messageIndex]}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            {queueSize !== null ? <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/60">Queue size: {queueSize}</p> : null}
            {matchPartner ? <p className="mt-3 text-sm font-medium text-emerald-300">Matched with {matchPartner?.fullName || 'a professional'}</p> : null}
          </div>
        </section>

        <aside className="grid gap-6 self-start">
          <StatusCard
            title="User status"
            value="Searching for a match"
            description="Your profile is live in the queue and being compared with professionals who share your goals and interests."
          />
          <section className="rounded-[2rem] card-dark p-6 shadow-lg shadow-black/25">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Matching preferences</h2>
              <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-white/70">Smart filter</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {preferenceItems.map((item) => (
                <PreferenceChip key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] card-dark-strong p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Queue controls</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Ready to stop searching?</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
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
