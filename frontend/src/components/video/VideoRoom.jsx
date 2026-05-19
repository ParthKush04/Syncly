import { useEffect, useMemo, useState } from 'react';
import { ParticipantView, StreamCall, StreamTheme, StreamVideo, useCallStateHooks, useDominantSpeaker } from '@stream-io/video-react-sdk';
import { useStreamVideoSession } from '../../context/StreamVideoSessionContext.jsx';

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function getParticipantLabel(participant) {
  return String(participant?.name || participant?.userId || (participant?.isLocalParticipant ? 'You' : 'Participant') || '').trim();
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
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Call ready</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">Your session is connected</h3>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Join the call when you’re ready. The Stream client is already initialized, so the session opens without extra navigation.
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
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/45">Status: {status}</p>
      </div>
    </div>
  );
}

function VideoCard({ participant, label, variant = 'main', subdued = false }) {
  const name = getParticipantLabel(participant);
  const initials = getInitials(name);

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/35 backdrop-blur-xl ${
        variant === 'grid' ? 'aspect-video min-h-0' : 'h-full min-h-0 w-full'
      } ${subdued ? 'opacity-95' : ''}`}
    >
      {participant ? (
        <ParticipantView
          participant={participant}
          trackType="videoTrack"
          mirror={Boolean(participant?.isLocalParticipant)}
          ParticipantViewUI={null}
          className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.9),rgba(15,23,42,0.9))]">
          <div className="grid place-items-center gap-3 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-[1.5rem] border border-white/10 bg-white/5 text-xl font-semibold text-white/80">
              {initials || '??'}
            </div>
            <p className="text-sm text-white/60">Camera waiting for connection</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04)_0%,rgba(2,6,23,0.08)_40%,rgba(2,6,23,0.9)_100%)]" />

      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/85 backdrop-blur-sm">
        {label}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/90">
            {participant?.isLocalParticipant ? 'You' : 'Remote participant'}
          </p>
          <h3 className={`mt-2 truncate font-semibold text-white ${variant === 'grid' ? 'text-lg' : 'text-2xl'}`}>
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

function TilePlaceholder({ title, subtitle }) {
  return (
    <div className="flex h-full w-full min-h-[40vh] min-w-0 items-center justify-center rounded-[2rem] border border-dashed border-white/12 card-dark p-6 text-center text-white/80 shadow-2xl shadow-black/20 lg:min-h-0">
      <div>
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-200/80">Waiting</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-7 text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}

function VideoStageHeader({ status, participantCount, layoutMode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
          {layoutMode}
        </span>
        <span className="text-white/60">{participantCount} participant(s)</span>
      </div>
      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
        {status}
      </span>
    </div>
  );
}

function MobileSpotlightLayout({ primaryParticipant, selfParticipant, secondaryParticipant }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-[48vh] flex-1">
        <VideoCard participant={primaryParticipant} label={primaryParticipant?.isLocalParticipant ? 'You' : 'Main speaker'} variant="main" />
      </div>

      {selfParticipant || secondaryParticipant ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {selfParticipant ? <VideoCard participant={selfParticipant} label="Self preview" variant="grid" subdued /> : null}
          {secondaryParticipant ? <VideoCard participant={secondaryParticipant} label="Next participant" variant="grid" subdued /> : null}
        </div>
      ) : null}
    </div>
  );
}

function DesktopSpotlightLayout({ primaryParticipant, selfParticipant }) {
  return (
    <div className="relative h-full min-h-0 w-full">
      <div className="h-full min-h-[min(62vh,48rem)] w-full">
        <VideoCard participant={primaryParticipant} label={primaryParticipant?.isLocalParticipant ? 'You' : 'Main speaker'} variant="main" />
      </div>

      {selfParticipant ? (
        <div className="absolute bottom-4 right-4 z-10 w-[clamp(170px,20vw,280px)]">
          <VideoCard participant={selfParticipant} label="Self preview" variant="grid" subdued />
        </div>
      ) : null}
    </div>
  );
}

function ParticipantGrid({ participants }) {
  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
      {participants.map((participant) => (
        <VideoCard
          key={participant.sessionId || participant.userId || participant.id}
          participant={participant}
          label={participant.isLocalParticipant ? 'You' : participant.isDominantSpeaker ? 'Active speaker' : 'Participant'}
          variant="grid"
        />
      ))}
    </div>
  );
}

function StageContent({ status, participants, primaryParticipant, selfParticipant, secondaryParticipant, isMobile, layoutMode }) {
  if (!participants.length) {
    return <WaitingPanel onJoin={null} joining={false} status={status} />;
  }

  if (participants.length > 2) {
    return <ParticipantGrid participants={participants} />;
  }

  if (isMobile) {
    return <MobileSpotlightLayout primaryParticipant={primaryParticipant} selfParticipant={selfParticipant} secondaryParticipant={secondaryParticipant} />;
  }

  return <DesktopSpotlightLayout primaryParticipant={primaryParticipant} selfParticipant={selfParticipant} />;
}

export default function VideoRoom({ onJoin = null, joining = false, status = 'ready' }) {
  const { client, call } = useStreamVideoSession();
  const { useParticipants, useCallCallingState } = useCallStateHooks();
  const participants = useParticipants();
  const callingState = useCallCallingState();
  const dominantSpeaker = useDominantSpeaker();
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth > 0 && viewportWidth < 768;

  const { orderedParticipants, localParticipant, remoteParticipants, primaryParticipant, selfParticipant, secondaryParticipant, layoutMode } = useMemo(() => {
    const nextParticipants = [...participants].sort((left, right) => {
      if (left.isLocalParticipant && !right.isLocalParticipant) {
        return 1;
      }

      if (!left.isLocalParticipant && right.isLocalParticipant) {
        return -1;
      }

      if (left.sessionId === dominantSpeaker?.sessionId && right.sessionId !== dominantSpeaker?.sessionId) {
        return -1;
      }

      if (left.sessionId !== dominantSpeaker?.sessionId && right.sessionId === dominantSpeaker?.sessionId) {
        return 1;
      }

      return 0;
    });

    const nextLocalParticipant = nextParticipants.find((participant) => participant.isLocalParticipant) || null;
    const nextRemoteParticipants = nextParticipants.filter((participant) => !participant.isLocalParticipant);
    const nextPrimaryParticipant =
      nextRemoteParticipants.find((participant) => participant.sessionId === dominantSpeaker?.sessionId) ||
      nextRemoteParticipants[0] ||
      nextLocalParticipant ||
      null;

    const nextSelfParticipant = nextLocalParticipant && nextPrimaryParticipant?.sessionId !== nextLocalParticipant.sessionId ? nextLocalParticipant : null;
    const nextSecondaryParticipant = nextRemoteParticipants.find((participant) => participant.sessionId !== nextPrimaryParticipant?.sessionId) || null;

    return {
      orderedParticipants: nextParticipants,
      localParticipant: nextLocalParticipant,
      remoteParticipants: nextRemoteParticipants,
      primaryParticipant: nextPrimaryParticipant,
      selfParticipant: nextSelfParticipant,
      secondaryParticipant: nextSecondaryParticipant,
      layoutMode: nextParticipants.length > 2 ? 'Grid layout' : isMobile ? 'Mobile stack' : 'Spotlight'
    };
  }, [dominantSpeaker, isMobile, participants]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <VideoStageHeader status={status} participantCount={participants.length} layoutMode={layoutMode} />

      <div className="relative min-h-0 flex-1">
        <StageContent
          status={status}
          participants={orderedParticipants}
          primaryParticipant={primaryParticipant}
          selfParticipant={selfParticipant}
          secondaryParticipant={secondaryParticipant}
          isMobile={isMobile}
          layoutMode={layoutMode}
        />
      </div>
    </div>
  );
}

export default function VideoRoom({ onJoin = null, joining = false, status = 'ready' }) {
  const { client, call } = useStreamVideoSession();

  if (!client) {
    return (
      <div className="grid h-full w-full flex-1 place-items-center rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-center text-white shadow-2xl shadow-black/30">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Video room</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Preparing your call experience</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">The Stream client is not ready yet. Please wait a moment and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex h-full w-full min-h-0 flex-1 items-stretch overflow-hidden rounded-[2.5rem] card-dark-strong p-3 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-4 lg:p-5">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.96)_100%)]" />

      <StreamVideo client={client}>
        {call ? (
          <StreamCall call={call}>
            <StreamTheme>
              <StageView />
            </StreamTheme>
          </StreamCall>
        ) : (
          <WaitingPanel onJoin={onJoin} joining={joining} status={status} />
        )}
      </StreamVideo>
    </section>
  );
}