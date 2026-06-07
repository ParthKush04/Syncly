import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/branding/Logo.jsx';
import SearchingOrb from '../components/matchmaking/SearchingOrb.jsx';
import StatusCard from '../components/matchmaking/StatusCard.jsx';
import PreferenceChip from '../components/matchmaking/PreferenceChip.jsx';
import { createMatchmakingSocket } from '../services/socketService.js';

const progressMessages = [
  'Scanning the queue...',
  'Looking for the next live connection...',
  'Waiting for another user to join...',
  'Preparing your best real match...'
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
  const [interests, setInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % progressMessages.length);
      setProgress((current) => Math.min(96, current + 12));
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem('synclyUser');

    if (!userJson) {
      setInterests([]);
      return;
    }

    try {
      const user = JSON.parse(userJson);
      const profileInterests = Array.isArray(user?.interests) ? user.interests : [];
      setInterests(profileInterests.map((interest) => String(interest).trim()).filter(Boolean));
    } catch {
      setInterests([]);
    }
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
      <div className="mx-auto w-full">
        {/* Two equal-width panels: Camera (left) and Waiting (right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[65vh]">
          {/* Left camera panel */}
          <section className="rounded-[2rem] card-dark-strong p-6 shadow-2xl shadow-black/30 sm:p-8 w-full flex flex-col h-full">
            <div className="flex items-center justify-between">
              <Logo compact className="mb-0" tone="light" />
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Active</div>
            </div>

            <div className="mt-6 flex-1 flex flex-col w-full">
              <div className="flex-1 w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 flex items-center justify-center min-h-[22rem]">
                {/* Video/image should fill available space */}
                {matchPartner ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 py-4">
                    <img
                      src={matchPartner.profileImage}
                      alt={matchPartner.fullName || matchPartner.name || 'Matched professional'}
                      className="max-h-36 h-36 w-36 rounded-full object-cover shadow-2xl"
                    />
                    <div className="text-center w-full">
                      <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Match found</p>
                      <p className="mt-3 text-2xl font-semibold text-white">{matchPartner.fullName || matchPartner.name || 'A verified professional'}</p>
                      {matchPartner.profession ? <p className="mt-2 text-sm text-white/70">{matchPartner.profession}</p> : null}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center px-6 py-4">
                    <div className="flex-1 w-full flex items-center justify-center">
                      <SearchingOrb />
                    </div>
                    <p className="text-sm uppercase tracking-[0.45em] text-white/80 mt-4">Searching</p>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-3xl card-dark p-5 w-full">
                <div className="flex items-center justify-between gap-4 text-sm text-white/80">
                  <span>{errorMessage || statusMessage || progressMessages[messageIndex]}</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                {queueSize !== null ? <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/60">Queue size: {queueSize}</p> : null}
                {matchPartner ? <p className="mt-3 text-sm font-medium text-emerald-300">Matched with {matchPartner?.fullName || 'a professional'}</p> : null}
              </div>
            </div>
          </section>

          {/* Right waiting panel */}
          <section className="rounded-[2rem] card-dark p-6 shadow-lg shadow-black/25 w-full flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-white/10 px-1 pb-3">
              <div>
                <p className="text-sm font-semibold text-white">Waiting for a real user</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">No match yet</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">Real only</span>
            </div>

            <div className="flex-1 grid place-items-center px-6 text-center text-white/60">
              <div>
                <div className="mb-4">
                  <SearchingOrb />
                </div>
                <p className="text-base font-medium text-white/75">You will only connect once another verified user is also in the matchmaking queue.</p>
                <p className="mt-2 text-sm leading-6 text-white/55">If no user is available yet, we keep searching and do not connect until the match is real.</p>
              </div>
            </div>

            <div className="mt-6 w-full">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-sm uppercase tracking-[0.35em] text-cyan-300">Matching preferences</h3>
                  <div className="mt-3">
                    <PreferenceChip label="Interests" value={interests.length > 0 ? interests.join(', ') : 'No interests set yet'} />
                  </div>
                </div>

                <div className="rounded-[1rem] card-dark-strong p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Queue controls</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">You can leave the matchmaking queue at any time and return when you’re ready to connect again.</p>
                  <button type="button" onClick={() => navigate('/dashboard')} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">Cancel matchmaking</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
