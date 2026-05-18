import { useState } from 'react';
import { useStreamVideoSession } from '../../context/StreamVideoSessionContext.jsx';

const initialFormState = {
  userId: 'demo-user-1',
  name: 'Demo User',
  image: '',
  callId: 'professional-networking-room',
  callType: 'default'
};

export default function VideoLobby() {
  const { startSession, joinCall, status, error, identity, callId, callType, setCallId, setCallType } = useStreamVideoSession();
  const [form, setForm] = useState(initialFormState);
  const [isBusy, setIsBusy] = useState(false);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'callId') {
      setCallId(value);
    }
    if (field === 'callType') {
      setCallType(value);
    }
  };

  const handleStartAndJoin = async (event) => {
    event.preventDefault();
    setIsBusy(true);

    try {
      const connectedClient = await startSession(form);
      if (connectedClient) {
        await joinCall({ callId: form.callId, callType: form.callType }, connectedClient);
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Stream Video SDK</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">One-on-one call lobby</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Connect a user, fetch a short-lived token from your backend, then join a one-on-one audio or video call.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleStartAndJoin}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            User ID
            <input
              value={form.userId}
              onChange={updateField('userId')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="user-123"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Display name
            <input
              value={form.name}
              onChange={updateField('name')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Amina Patel"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-slate-600">
          Profile image URL
          <input
            value={form.image}
            onChange={updateField('image')}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
            placeholder="https://..."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            Call type
            <select
              value={form.callType}
              onChange={updateField('callType')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
            >
              <option value="default">Default</option>
              <option value="audio_room">Audio room</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            Call ID
            <input
              value={form.callId}
              onChange={updateField('callId')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="one-on-one-room"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? 'Connecting...' : 'Connect and join call'}
        </button>
      </form>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-4">
          <span>Status</span>
          <span className="font-medium text-slate-900">{status}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Connected user</span>
          <span className="font-medium text-slate-900">{identity.name || 'None'}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Active call</span>
          <span className="font-medium text-slate-900">{callType ? `${callType} / ${callId}` : 'None'}</span>
        </div>
        {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-rose-700">{error}</p> : null}
      </div>
    </section>
  );
}