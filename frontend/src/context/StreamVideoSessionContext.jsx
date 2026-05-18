import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { fetchStreamToken } from '../services/streamVideoService.js';

const StreamVideoSessionContext = createContext(null);

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const DEFAULT_CALL_TYPE = import.meta.env.VITE_STREAM_DEFAULT_CALL_TYPE || 'default';

export function StreamVideoSessionProvider({ children }) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [identity, setIdentity] = useState({
    userId: '',
    name: '',
    image: ''
  });
  const [callId, setCallId] = useState('demo-call');
  const [callType, setCallType] = useState(DEFAULT_CALL_TYPE);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const disconnect = useCallback(async () => {
    if (call) {
      try {
        await call.leave();
      } catch (leaveError) {
        console.error('Failed to leave Stream call', leaveError);
      }
      setCall(null);
    }

    if (client) {
      try {
        await client.disconnectUser();
      } catch (disconnectError) {
        console.error('Failed to disconnect Stream user', disconnectError);
      }
      setClient(null);
    }

    setStatus('idle');
  }, [call, client]);

  const startSession = useCallback(
    async (nextIdentity) => {
      if (!API_KEY) {
        setError('VITE_STREAM_API_KEY is not configured');
        return false;
      }

      const userId = String(nextIdentity.userId || '').trim();
      const name = String(nextIdentity.name || '').trim();

      if (!userId || !name) {
        setError('User ID and name are required to start a video session');
        return false;
      }

      setStatus('connecting');
      setError('');

      try {
        if (client) {
          await disconnect();
        }

        const user = {
          id: userId,
          name,
          image: nextIdentity.image || ''
        };

        const tokenProvider = async () => fetchStreamToken(user);

        const nextClient = new StreamVideoClient({
          apiKey: API_KEY,
          user,
          tokenProvider
        });

        setIdentity(user);
        setClient(nextClient);
        setStatus('ready');
        return nextClient;
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : 'Failed to start Stream session');
        setStatus('error');
        return false;
      }
    },
    [client, disconnect]
  );

  const joinCall = useCallback(
    async (overrides = {}, clientOverride = null) => {
      const activeClient = clientOverride || client;

      if (!activeClient) {
        setError('Create a video session before joining a call');
        return false;
      }

      const nextCallType = overrides.callType || callType;
      const nextCallId = overrides.callId || callId;

      if (!nextCallId.trim()) {
        setError('Call ID is required');
        return false;
      }

      setStatus('joining');
      setError('');

      try {
        const activeCall = activeClient.call(nextCallType, nextCallId.trim());
        await activeCall.join({ create: true });

        setCall(activeCall);
        setCallType(nextCallType);
        setCallId(nextCallId.trim());
        setStatus('in-call');
        return true;
      } catch (joinError) {
        setError(joinError instanceof Error ? joinError.message : 'Failed to join the call');
        setStatus('ready');
        return false;
      }
    },
    [callId, callType, client]
  );

  const leaveCall = useCallback(async () => {
    if (!call) {
      return;
    }

    setStatus('leaving');

    try {
      await call.leave();
    } catch (leaveError) {
      console.error('Failed to leave call', leaveError);
    } finally {
      setCall(null);
      setStatus('ready');
    }
  }, [call]);

  useEffect(() => {
    return () => {
      disconnect().catch((disconnectError) => {
        console.error('Failed to clean up Stream session', disconnectError);
      });
    };
  }, [disconnect]);

  const value = useMemo(
    () => ({
      API_KEY,
      client,
      call,
      identity,
      callId,
      callType,
      status,
      error,
      setError,
      setIdentity,
      setCallId,
      setCallType,
      startSession,
      joinCall,
      leaveCall,
      disconnect,
      isConnected: Boolean(client),
      isInCall: Boolean(call)
    }),
    [client, call, identity, callId, callType, status, error, startSession, joinCall, leaveCall, disconnect]
  );

  return <StreamVideoSessionContext.Provider value={value}>{children}</StreamVideoSessionContext.Provider>;
}

export function useStreamVideoSession() {
  const context = useContext(StreamVideoSessionContext);

  if (!context) {
    throw new Error('useStreamVideoSession must be used within StreamVideoSessionProvider');
  }

  return context;
}