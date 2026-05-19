import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CallHeader from '../components/videoCall/CallHeader.jsx';
import VideoPane from '../components/videoCall/VideoPane.jsx';
import CallControls from '../components/videoCall/CallControls.jsx';
import VideoRoom from '../components/video/VideoRoom.jsx';
import { useStreamVideoSession } from '../context/StreamVideoSessionContext.jsx';

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

export default function VideoCallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ensureSessionAndJoin, status, error, setError, isInCall, setCallId, setCallType, leaveCall, disconnect } = useStreamVideoSession();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isExitingCall, setIsExitingCall] = useState(false);
  const lastJoinKeyRef = useRef('');
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
      if (lastJoinKeyRef.current === joinKey) {
        return undefined;
      }

      lastJoinKeyRef.current = joinKey;

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
          lastJoinKeyRef.current = '';
        }
      });
    } catch {
      setError('Cached user data is invalid. Please sign in again.');
    }

    return () => {
      cancelled = true;
    };
  }, [ensureSessionAndJoin, searchParams, setCallId, setCallType, setError]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const sessionTime = useMemo(() => formatTime(elapsedSeconds), [elapsedSeconds]);

  const exitCallAndNavigate = async (destination, reason) => {
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
      setElapsedSeconds(0);
      setIsExitingCall(false);
      exitInProgressRef.current = false;
      navigate(destination, { replace: true });
    }
  };

  const handleSkip = async () => {
    await exitCallAndNavigate('/matchmaking', 'skip');
  };

  const handleLeaveToDashboard = async () => {
    await exitCallAndNavigate('/dashboard', 'leave-dashboard');
  };

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <CallHeader sessionTime={sessionTime} connectionStatus={isInCall ? 'Connected' : status} roomName="Professional video call" />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-6">
            <VideoRoom onSkip={handleSkip} onLeaveToDashboard={handleLeaveToDashboard} isExitingCall={isExitingCall} />

            <div className="grid gap-6 sm:grid-cols-2">
              <VideoPane title="Your camera" subtitle="Previewing local audio and video" accent="emerald" isLocal={true} />

              <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/80 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Session details</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <InfoRow label="Session timer" value={sessionTime} />
                  <InfoRow label="Status" value={isInCall ? 'In call' : status} />
                  <InfoRow label="Camera" value={isInCall ? 'Live' : 'Waiting'} />
                  <InfoRow label="Connection" value="Stable" />
                </div>
              </aside>
            </div>
          </div>

          <div className="grid gap-6 self-start">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Call summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Focused, premium communication</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Keep the conversation centered with a clear visual hierarchy, strong contrast, and controls that feel natural on every screen size.
              </p>

              <div className="mt-5 grid gap-3">
                <MiniStat label="Local stream" value={isInCall ? 'Ready' : 'Connecting'} />
                <MiniStat label="Remote stream" value={isInCall ? 'Live' : 'Waiting'} />
                <MiniStat label="Call duration" value={sessionTime} />
              </div>
            </section>

            <CallControls
              onSkip={handleSkip}
              onLeave={handleLeaveToDashboard}
              isBusy={isExitingCall}
            />

            <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-5 text-sm leading-7 text-cyan-900">
              {error || 'Tip: matchmaking now routes into the real Stream video flow, so a match can open an actual call session.'}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
