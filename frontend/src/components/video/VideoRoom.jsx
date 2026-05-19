import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  useCall,
  useCallStateHooks
} from '@stream-io/video-react-sdk';

import ErrorBoundary from '../common/ErrorBoundary.jsx';
import CallControls from '../videoCall/CallControls.jsx';
import { useStreamVideoSession } from '../../context/StreamVideoSessionContext.jsx';

function useViewportWidth() {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function getDisplayName(participant) {
  return String(
    participant?.name ||
      participant?.userId ||
      (participant?.isLocalParticipant ? 'You' : 'Participant') ||
      ''
  ).trim();
}

function getInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function WaitingPanel({ onJoin, joining, status }) {
  return (
    <div className="grid h-full w-full min-h-0 place-items-center rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 text-center text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="max-w-lg">
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">
          Call ready
        </p>

        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Your session is connected
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/70">
          Join the call when you’re ready.
        </p>

        {onJoin ? (
          <button
            type="button"
            onClick={onJoin}
            disabled={joining}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joining ? 'Joining...' : 'Join call'}
          </button>
        ) : null}

        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/45">
          Status: {status}
        </p>
      </div>
    </div>
  );
}

function VideoFrame({
  participant,
  label,
  size = 'hero',
  overlay = false,
  mirror = false
}) {
  const name = getDisplayName(participant);

  const initials = getInitials(name);

  const sizeClass =
    size === 'preview'
      ? 'aspect-[4/5] w-full min-h-[11rem] sm:aspect-video sm:min-h-[12rem] md:min-h-[14rem]'
      : 'aspect-[4/5] w-full min-h-[18rem] sm:aspect-video sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[32rem]';

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 ${sizeClass} ${
        overlay ? 'ring-1 ring-white/10' : ''
      }`}
    >
      {/* Always mount ParticipantView so Stream can attach video/audio tracks. */}
      {participant ? (
        <ParticipantView
          participant={participant}
          trackType="videoTrack"
          mirror={mirror}
          ParticipantViewUI={null}
          className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.9),rgba(15,23,42,0.9))]">
          <div className="grid place-items-center gap-3 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-[1.5rem] border border-white/10 bg-white/5 text-xl font-semibold text-white/80">
              {initials || '??'}
            </div>

            <p className="text-sm text-white/60">
              Camera loading...
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.08)_40%,rgba(2,6,23,0.92)_100%)]" />

      {/* Top label */}
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/85 backdrop-blur-sm">
        {label}
      </div>

      {/* Bottom user info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/90">
            {participant?.isLocalParticipant
              ? 'You'
              : 'Connected'}
          </p>

          <h3 className="mt-2 truncate text-2xl font-semibold text-white">
            {name || 'Participant'}
          </h3>
        </div>

        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur-sm">
          Live
        </div>
      </div>
    </div>
  );
}

function VideoStageHeader({
  status,
  participantCount
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
          Video room
        </span>

        <span className="text-white/60">
          {participantCount} participant(s)
        </span>
      </div>

      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
        {status}
      </span>
    </div>
  );
}

/* OME TV STYLE LAYOUT */
function TwoPersonLayout({
  primaryParticipant,
  selfParticipant
}) {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4 items-stretch">
      <div className="min-h-0">
        <VideoFrame
          participant={primaryParticipant}
          label={primaryParticipant ? 'Connected' : 'Waiting'}
          size="hero"
          mirror={false}
        />
      </div>

      <div className="min-h-0">
        {selfParticipant ? (
          <VideoFrame
            participant={selfParticipant}
            label="You"
            size="hero"
            overlay
            mirror
          />
        ) : (
          <VideoFrame
            participant={null}
            label="You"
            size="hero"
            overlay
            mirror
          />
        )}
      </div>
    </div>
  );
}

function StageContent({
  participants,
  primaryParticipant,
  selfParticipant,
  status,
  onJoin,
  joining
}) {
  if (!participants.length) {
    return (
      <WaitingPanel
        onJoin={onJoin}
        joining={joining}
        status={status}
      />
    );
  }

  return (
    <TwoPersonLayout
      primaryParticipant={primaryParticipant}
      selfParticipant={selfParticipant}
    />
  );
}

function VideoStage({
  status,
  onJoin,
  joining,
  onSkip,
  onLeave,
  isExitingCall
}) {
  const callStateHooks = useCallStateHooks();
  const useLocalParticipant = callStateHooks?.useLocalParticipant;
  const useRemoteParticipants = callStateHooks?.useRemoteParticipants;
  const useCallCallingState = callStateHooks?.useCallCallingState;
  const useIsAutoplayBlocked = callStateHooks?.useIsAutoplayBlocked;
  const call = useCall();

  /* SAFE PARTICIPANTS */
  const localParticipant = useLocalParticipant ? useLocalParticipant() : null;
  const remoteParticipants = useRemoteParticipants ? useRemoteParticipants() : [];
  const participants = [
    ...(localParticipant ? [localParticipant] : []),
    ...remoteParticipants
  ];

  const callingState = useCallCallingState ? useCallCallingState() : null;
  const isAutoplayBlocked = useIsAutoplayBlocked ? useIsAutoplayBlocked() : false;

  const handleResumeAudio = useCallback(() => {
    void call?.resumeAudio?.();
  }, [call]);

  useViewportWidth();

  const {
    primaryParticipant,
    selfParticipant
  } = useMemo(() => {
    const nextLocalParticipant = localParticipant || null;
    const nextRemoteParticipant = remoteParticipants[0] || null;

    return {
      primaryParticipant: nextRemoteParticipant || nextLocalParticipant,
      selfParticipant: nextLocalParticipant
    };
  }, [localParticipant, remoteParticipants]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <VideoStageHeader
        status={callingState || status}
        participantCount={participants.length}
      />

      <div className="shrink-0 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-black/35 backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <CallControls onSkip={onSkip} onLeave={onLeave} isBusy={isExitingCall} />
          </div>
        </div>
      </div>

      {isAutoplayBlocked ? (
        <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-cyan-300/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50">
          <p>Audio is blocked by the browser until you allow playback.</p>
          <button
            type="button"
            onClick={handleResumeAudio}
            className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Enable audio
          </button>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <StageContent
          participants={participants}
          primaryParticipant={primaryParticipant}
          selfParticipant={selfParticipant}
          status={callingState || status}
          onJoin={onJoin}
          joining={joining}
        />
      </div>
    </div>
  );
}

export default function VideoRoom({
  onJoin = null,
  onSkip = null,
  onLeave = null,
  joining = false,
  status = 'ready',
  isExitingCall = false
}) {
  const { client, call } = useStreamVideoSession();

  if (!client) {
    return (
      <div className="grid h-full w-full flex-1 place-items-center rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-center text-white shadow-2xl shadow-black/30">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Video room</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Preparing your call experience</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">The Stream client is not ready yet.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex h-full w-full min-h-0 flex-1 items-stretch overflow-hidden rounded-[2.5rem] p-3 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-4 lg:p-5">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,236,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.96)_100%)]" />

      <StreamVideo client={client}>
        <ErrorBoundary>
          {call ? (
            <StreamCall call={call}>
              <StreamTheme>
                <div className="flex h-full min-h-0 w-full flex-col gap-3">
                  <div className="min-h-0 flex-1">
                    <VideoStage
                      onJoin={onJoin}
                      joining={joining}
                      status={status}
                      onSkip={onSkip}
                      onLeave={onLeave}
                      isExitingCall={isExitingCall}
                    />
                  </div>
                </div>
              </StreamTheme>
            </StreamCall>
          ) : (
            <WaitingPanel onJoin={onJoin} joining={joining} status={status} />
          )}
        </ErrorBoundary>
      </StreamVideo>
    </section>
  );
}