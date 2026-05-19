import { useMemo } from 'react';
import { ParticipantView, StreamCall, StreamTheme, StreamVideo, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useStreamVideoSession } from '../../context/StreamVideoSessionContext.jsx';

function WaitingPanel({ onJoin, joining, status }) {
  return (
    <div className="grid h-full min-h-[56vh] place-items-center rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-center text-white shadow-2xl shadow-black/30 sm:min-h-[68vh] lg:min-h-[78vh]">
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Call ready</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">Your session is connected</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Join the call when you’re ready. The Stream client is already initialized, so the session will open without extra navigation.
        </p>
        {onJoin ? (
          <button
            type="button"
            onClick={onJoin}
            disabled={joining}
            className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joining ? 'Joining...' : 'Join call'}
          </button>
        ) : null}
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">Status: {status}</p>
      </div>
    </div>
  );
}

function TilePlaceholder({ title, subtitle }) {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-center text-white/80 shadow-2xl shadow-black/20 lg:min-h-0">
      <div>
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-200/80">Waiting</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-7 text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}

function ParticipantTile({ participant, slotLabel }) {
  const displayName = String(participant?.name || (participant?.isLocalParticipant ? 'You' : 'Participant') || '').trim();

  return (
    <div className="group relative min-h-[40vh] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/30 lg:min-h-0">
      <ParticipantView
        participant={participant}
        trackType="videoTrack"
        mirror={Boolean(participant?.isLocalParticipant)}
        ParticipantViewUI={null}
        className="absolute inset-0"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.14)_35%,rgba(2,6,23,0.9)_100%)]" />

      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur-sm">
        {slotLabel}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/90">{participant?.isLocalParticipant ? 'You' : 'Connected professional'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{displayName || 'Participant'}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
          Live
        </div>
      </div>
    </div>
  );
}

function StageView() {
  const { useParticipants, useCallCallingState } = useCallStateHooks();
  const participants = useParticipants();
  const callingState = useCallCallingState();

  const [localParticipant, remoteParticipant] = useMemo(() => {
    const local = participants.find((participant) => participant.isLocalParticipant) || null;
    const remote = participants.find((participant) => !participant.isLocalParticipant) || null;
    return [local, remote];
  }, [participants]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm">
        <span className="uppercase tracking-[0.35em] text-cyan-200/90">{callingState}</span>
        <span>{participants.length} participant(s)</span>
      </div>

      <div className="grid flex-1 min-h-0 gap-3 xl:grid-cols-2">
        {localParticipant ? (
          <ParticipantTile participant={localParticipant} slotLabel="Your screen" />
        ) : (
          <TilePlaceholder title="Your camera" subtitle="Your local stream will appear here once media is available." />
        )}

        {remoteParticipant ? (
          <ParticipantTile participant={remoteParticipant} slotLabel="Other person" />
        ) : (
          <TilePlaceholder title="Waiting for the next person" subtitle="When another participant joins, they will appear here at equal size." />
        )}
      </div>
    </div>
  );
}

export default function VideoRoom({ onJoin = null, joining = false, status = 'ready' }) {
  const { client, call } = useStreamVideoSession();

  if (!client) {
    return (
      <div className="grid flex-1 place-items-center rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-center text-white shadow-2xl shadow-black/30">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Video room</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Preparing your call experience</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">The Stream client is not ready yet. Please wait a moment and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex h-full min-h-0 flex-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-3 shadow-[0_35px_100px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-4 lg:p-5">
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