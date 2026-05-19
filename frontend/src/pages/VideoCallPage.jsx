import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/branding/Logo.jsx';
import CallControls from '../components/videoCall/CallControls.jsx';
import VideoRoom from '../components/video/VideoRoom.jsx';
import { useStreamVideoSession } from '../context/StreamVideoSessionContext.jsx';

export default function VideoCallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ensureSessionAndJoin, status, error, setError, isInCall, setCallId, setCallType, leaveCall, disconnect } = useStreamVideoSession();
  const [isExitingCall, setIsExitingCall] = useState(false);
  const joinKeyRef = useRef('');
  const exitInProgressRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('synclyToken');
    const userJson = localStorage.getItem('synclyUser');

    if (!token || !userJson) {
      setError('Authentication is missing. Please sign in again.');
      return undefined;
    }

    const callId = searchParams.get('callId') || searchParams.get('sessionId') || 'professional-networking-room';
    const callType = searchParams.get('callType') || 'default';
    let cancelled = false;

    try {
      const user = JSON.parse(userJson);
      const authUserId = String(user?._id || '').trim();

      if (!authUserId) {
        setError('Authenticated user id is missing. Please sign in again.');
        return undefined;
      }

      const identity = {
        userId: authUserId,
        name: String(user.fullName || user.name || 'User').trim(),
        image: String(user.profileImage || user.photoUrl || '').trim()
      };

      const joinKey = `${identity.userId}:${callType}:${callId}`;
      if (joinKeyRef.current === joinKey) {
        return undefined;
      }

      joinKeyRef.current = joinKey;

      console.log('[video-call] auth/token readiness', {
        hasToken: Boolean(token),
        userId: identity.userId,
        callType,
        callId
      });

      setCallId(callId);
      setCallType(callType);

      void ensureSessionAndJoin({
        identity,
        callId,
        callType
      }).then((joined) => {
        if (!joined && !cancelled) {
          joinKeyRef.current = '';
        }
      });
    } catch {
      setError('Cached user data is invalid. Please sign in again.');
    }

    return () => {
      cancelled = true;
    };
  }, [ensureSessionAndJoin, searchParams, setCallId, setCallType, setError]);

  const exitAndNavigate = useCallback(
    async (destination, reason) => {
      if (exitInProgressRef.current) {
        return;
      }

      exitInProgressRef.current = true;
      setIsExitingCall(true);

      try {
        console.log('[video-call] exit flow start', { destination, reason });
        await leaveCall();
        await disconnect();
        console.log('[video-call] exit flow success', { destination, reason });
      } catch (exitError) {
        console.error('[video-call] exit flow failed', {
          destination,
          reason,
          message: exitError instanceof Error ? exitError.message : exitError
        });
      } finally {
        setIsExitingCall(false);
        exitInProgressRef.current = false;
        navigate(destination, { replace: true });
      }
    },
    [disconnect, leaveCall, navigate]
  );

  const handleSkip = useCallback(() => exitAndNavigate('/matchmaking', 'skip'), [exitAndNavigate]);
  const handleLeave = useCallback(() => exitAndNavigate('/dashboard', 'leave-dashboard'), [exitAndNavigate]);

  const callStatusLabel = useMemo(() => {
    if (isExitingCall) {
      return 'Leaving...';
    }

    return isInCall ? 'Connected' : status;
  }, [isExitingCall, isInCall, status]);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_35%,rgba(255,255,255,0.03)_100%)]" />
      <div className="relative flex min-h-[100dvh] flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <header className="mb-3 flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:mb-4">
          <Logo compact className="scale-90 origin-left text-white [&_p]:text-white [&_p:last-child]:text-slate-300" />
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-300">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">{callStatusLabel}</span>
            <span className="hidden sm:inline">Video room</span>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <VideoRoom joining={status === 'joining'} status={callStatusLabel} />
        </div>

        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-3 sm:bottom-5 sm:px-4">
          <div className="w-full max-w-md rounded-full border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <CallControls onSkip={handleSkip} onLeave={handleLeave} isBusy={isExitingCall} />
          </div>
        </div>

        {error ? (
          <div className="pointer-events-none fixed left-1/2 top-20 z-30 w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl border border-rose-400/25 bg-rose-500/15 px-4 py-3 text-sm text-rose-100 shadow-2xl shadow-black/30 backdrop-blur-xl">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}