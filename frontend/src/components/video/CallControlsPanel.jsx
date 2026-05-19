import { useCallback, useRef } from 'react';
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

export default function CallControlsPanel({ onSkip, onLeaveToDashboard, onLeave, isExitingCall = false }) {
  const call = useCall();
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const { microphone, isMute: isMicrophoneMuted } = useMicrophoneState();
  const leavingRef = useRef(false);

  const handleLeave = useCallback(async () => {
    if (leavingRef.current) {
      return;
    }

    leavingRef.current = true;

    if (onLeave) {
      try {
        await onLeave();
      } catch (error) {
        console.error('[stream-session] onLeave handler failed', error);
      } finally {
        leavingRef.current = false;
      }
      return;
    }

    if (call) {
      try {
        await call.leave();
      } catch (error) {
        const message = String(error?.message || error || '').toLowerCase();
        if (!message.includes('already been left')) {
          console.error('[stream-session] call.leave from controls failed', error);
        }
      }
    }

    leavingRef.current = false;
  }, [call, onLeave]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <ToggleButton active={!isMicrophoneMuted} label={isMicrophoneMuted ? 'Unmute' : 'Mute'} onClick={() => microphone.toggle()} />
      <ToggleButton active={!isCameraMuted} label={isCameraMuted ? 'Camera off' : 'Camera on'} onClick={() => camera.toggle()} />
      <button
        type="button"
        onClick={onSkip}
        disabled={isExitingCall || leavingRef.current}
        className="rounded-2xl border border-cyan-200 bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExitingCall ? 'Processing...' : 'Skip'}
      </button>
      <button
        type="button"
        onClick={onLeaveToDashboard || handleLeave}
        disabled={isExitingCall || leavingRef.current}
        className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Leave call
      </button>
    </div>
  );
}