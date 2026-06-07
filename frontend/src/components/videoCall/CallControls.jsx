import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';

function IconButton({ label, active, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3 ${
        active
          ? 'border-white/10 bg-white/10 text-white hover:bg-white/15'
          : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function MicIcon({ muted }) {
  return muted ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M9 9V7a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 12a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M9 9V7a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 12a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon({ off }) {
  return off ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M15 8h2a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 8l7 7V9a2 2 0 0 0-2-2H3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 16h7a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 8h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 10l5-3v10l-5-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 7h7l5 5-5 5H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M10 7h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 12H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function CallControls({ onSkip, onLeave, isBusy = false }) {
  const callStateHooks = useCallStateHooks();
  const call = useCall();
  const useCameraState = callStateHooks?.useCameraState;
  const useMicrophoneState = callStateHooks?.useMicrophoneState;
  const cameraState = call && useCameraState ? useCameraState() : { camera: { toggle: () => {} }, isMute: true };
  const microphoneState = call && useMicrophoneState ? useMicrophoneState() : { microphone: { toggle: () => {} }, isMute: true };
  const { camera, isMute: isCameraMuted } = cameraState;
  const { microphone, isMute: isMicrophoneMuted } = microphoneState;
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <IconButton label={isMicrophoneMuted ? 'Unmute' : 'Mute'} active={!isMicrophoneMuted} onClick={() => microphone.toggle()} disabled={isBusy}>
        <MicIcon muted={isMicrophoneMuted} />
      </IconButton>

      <IconButton label={isCameraMuted ? 'Camera on' : 'Camera off'} active={!isCameraMuted} onClick={() => camera.toggle()} disabled={isBusy}>
        <CameraIcon off={isCameraMuted} />
      </IconButton>

      <IconButton label="Skip" active={false} onClick={onSkip} disabled={isBusy}>
        <SkipIcon />
      </IconButton>

      <button
        type="button"
        onClick={onLeave}
        disabled={isBusy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LeaveIcon />
        <span className="hidden sm:inline">{isBusy ? 'Processing...' : 'Leave'}</span>
      </button>

      <button
        type="button"
        onClick={onLeave}
        disabled={isBusy}
        className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>
    </div>
  );
}
