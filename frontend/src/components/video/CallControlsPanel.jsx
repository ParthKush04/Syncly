import { useCallback } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

function ToggleButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          : 'border-cyan-200 bg-cyan-500 text-white hover:bg-cyan-400'
      }`}
    >
      {label}
    </button>
  );
}

export default function CallControlsPanel({ onLeave }) {
  const call = useCall();
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const { microphone, isMute: isMicrophoneMuted } = useMicrophoneState();

  const handleLeave = useCallback(async () => {
    if (onLeave) {
      await onLeave();
      return;
    }

    if (call) {
      await call.leave();
    }
  }, [call, onLeave]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <ToggleButton active={!isMicrophoneMuted} label={isMicrophoneMuted ? 'Unmute' : 'Mute'} onClick={() => microphone.toggle()} />
      <ToggleButton active={!isCameraMuted} label={isCameraMuted ? 'Camera off' : 'Camera on'} onClick={() => camera.toggle()} />
      <button
        type="button"
        onClick={handleLeave}
        className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
      >
        Leave call
      </button>
    </div>
  );
}