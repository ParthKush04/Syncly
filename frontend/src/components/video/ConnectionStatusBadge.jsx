import { useCallStateHooks, useConnectedUser } from '@stream-io/video-react-sdk';

export default function ConnectionStatusBadge() {
  const connectedUser = useConnectedUser();
  const callStateHooks = useCallStateHooks();
  const useCallCallingState = callStateHooks?.useCallCallingState;
  const useIsAutoplayBlocked = callStateHooks?.useIsAutoplayBlocked;
  const useParticipants = callStateHooks?.useParticipants;

  const callingState = useCallCallingState ? useCallCallingState() : null;
  const isAutoplayBlocked = useIsAutoplayBlocked ? useIsAutoplayBlocked() : false;
  const participants = useParticipants ? useParticipants() : [];

  return (
    <div className="grid gap-3 rounded-3xl border border-white/12 bg-white/8 p-4 text-sm text-white/72 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <span>Connection</span>
        <span className="font-semibold text-cyan-100">{callingState || 'idle'}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>User</span>
        <span className="font-semibold text-white">{connectedUser?.name || 'Disconnected'}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>Participants</span>
        <span className="font-semibold text-white">{participants.length}</span>
      </div>
      {isAutoplayBlocked ? (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-cyan-100">
          Audio playback is blocked by the browser until the next user interaction.
        </div>
      ) : null}
    </div>
  );
}