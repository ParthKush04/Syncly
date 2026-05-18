import { StreamCall, StreamTheme, SpeakerLayout, StreamVideo, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useStreamVideoSession } from '../../context/StreamVideoSessionContext.jsx';
import CallControlsPanel from './CallControlsPanel.jsx';
import ConnectionStatusBadge from './ConnectionStatusBadge.jsx';

function WaitingPanel({ onJoin, joining }) {
  const { status, callId, callType } = useStreamVideoSession();

  return (
    <div className="grid h-full place-items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
      <div className="max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">Call ready</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">Join your one-on-one session</h3>
        <p className="mt-4 leading-6">
          You are connected to Stream. Click join to load the call, then your camera and microphone controls become active.
        </p>
        <button
          type="button"
          onClick={onJoin}
          disabled={joining}
          className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {joining ? 'Joining...' : `Join ${callType} / ${callId}`}
        </button>
        <p className="mt-4 text-sm text-slate-500">Status: {status}</p>
      </div>
    </div>
  );
}

function ActiveCallView({ onLeave }) {
  const { useParticipants, useCallCallingState } = useCallStateHooks();
  const participants = useParticipants();
  const callingState = useCallCallingState();

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80">
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1 text-sm text-slate-500">
          <span>Call state: {callingState}</span>
          <span>{participants.length} participant(s)</span>
        </div>
        <div className="overflow-hidden rounded-[1.5rem]">
          <SpeakerLayout participantBarPosition="right" />
        </div>
      </div>

      <div className="grid gap-4 self-start">
        <ConnectionStatusBadge />
        <CallControlsPanel onLeave={onLeave} />
      </div>
    </div>
  );
}

export default function VideoRoom() {
  const { client, call, joinCall, leaveCall, status } = useStreamVideoSession();

  if (!client) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Video room</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Waiting for a connected Stream user</h2>
        <p className="mt-3 leading-6">
          Configure the lobby, connect a user, and then the room will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Live room</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">One-on-one audio/video call</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {status}
        </div>
      </div>

      <StreamVideo client={client}>
        {call ? (
          <StreamCall call={call}>
            <StreamTheme>
              <ActiveCallView onLeave={leaveCall} />
            </StreamTheme>
          </StreamCall>
        ) : (
          <WaitingPanel onJoin={joinCall} joining={status === 'joining'} />
        )}
      </StreamVideo>
    </section>
  );
}