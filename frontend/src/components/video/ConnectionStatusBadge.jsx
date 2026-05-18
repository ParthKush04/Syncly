import { useCallStateHooks, useConnectedUser } from '@stream-io/video-react-sdk';

export default function ConnectionStatusBadge() {
  const connectedUser = useConnectedUser();
  const { useCallCallingState, useIsAutoplayBlocked, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isAutoplayBlocked = useIsAutoplayBlocked();
  const participants = useParticipants();

  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      <div className="flex items-center justify-between gap-4">
        <span>Connection</span>
        <span className="font-semibold text-cyan-700">{callingState || 'idle'}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>User</span>
        <span className="font-semibold text-slate-900">{connectedUser?.name || 'Disconnected'}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>Participants</span>
        <span className="font-semibold text-slate-900">{participants.length}</span>
      </div>
      {isAutoplayBlocked ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-800">
          Audio playback is blocked by the browser until the next user interaction.
        </div>
      ) : null}
    </div>
  );
}