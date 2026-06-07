import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { fetchStreamToken } from '../services/streamVideoService.js';
import { disconnectStreamClient, getCurrentStreamClient, getOrCreateStreamClient } from '../services/streamClientService.js';

const StreamVideoSessionContext = createContext(null);

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const DEFAULT_CALL_TYPE = import.meta.env.VITE_STREAM_DEFAULT_CALL_TYPE || 'default';
const MAX_SAFE_STREAM_IMAGE_LENGTH = 2048;

function sanitizeStreamImage(rawImage) {
  const image = String(rawImage || '').trim();
  if (!image) {
    return '';
  }
  if (image.startsWith('data:')) {
    return '';
  }
  if (image.length > MAX_SAFE_STREAM_IMAGE_LENGTH) {
    return '';
  }
  return image;
}

export function StreamVideoSessionProvider({ children }) {
  const [client, setClient] = useState(() => getCurrentStreamClient());
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
  const clientRef = useRef(client);
  const callRef = useRef(call);
  const joinPromiseRef = useRef(null);
  const leavePromiseRef = useRef(null);

  clientRef.current = client;
  callRef.current = call;

  const readAuthState = useCallback(() => {
    const token = localStorage.getItem('synclyToken');
    const userRaw = localStorage.getItem('synclyUser');
    let user = null;

    if (userRaw) {
      try {
        user = JSON.parse(userRaw);
      } catch {
        user = null;
      }
    }

    const authUserId = String(user?._id || '').trim();
    const ready = Boolean(token && user && authUserId);

    console.log('[stream-session] auth readiness', {
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      authUserId,
      ready
    });

    return {
      token,
      user,
      authUserId,
      ready
    };
  }, []);

  const safeLeaveCall = useCallback(async (reason = 'manual') => {
    const activeCall = callRef.current;

    if (!activeCall) {
      return;
    }

    if (leavePromiseRef.current) {
      await leavePromiseRef.current;
      return;
    }

    leavePromiseRef.current = (async () => {
      try {
        console.log('[stream-session] call.leave start', {
          callType: activeCall.type,
          callId: activeCall.id,
          reason
        });
        await activeCall.leave();
        console.log('[stream-session] call.leave success', {
          callType: activeCall.type,
          callId: activeCall.id,
          reason
        });
      } catch (leaveError) {
        const message = String(leaveError?.message || leaveError || '');
        if (message.toLowerCase().includes('already been left')) {
          console.log('[stream-session] call already left', {
            callType: activeCall.type,
            callId: activeCall.id,
            reason
          });
        } else {
          console.error('[stream-session] call.leave failed', {
            callType: activeCall.type,
            callId: activeCall.id,
            reason,
            message
          });
        }
      } finally {
        if (callRef.current === activeCall) {
          callRef.current = null;
          setCall(null);
        }
        leavePromiseRef.current = null;
      }
    })();

    await leavePromiseRef.current;
  }, []);

  const disconnect = useCallback(async () => {
    await safeLeaveCall('disconnect');

    await disconnectStreamClient('session-disconnect');
    clientRef.current = null;
    setClient(null);

    setStatus('idle');
  }, [safeLeaveCall]);

  const startSession = useCallback(
    async (nextIdentity) => {
      if (!API_KEY) {
        setError('VITE_STREAM_API_KEY is not configured');
        return false;
      }

      const authState = readAuthState();
      if (!authState.ready) {
        setError('Authentication is required before creating a Stream session');
        setStatus('error');
        return false;
      }

      const userId = String(nextIdentity?.userId || authState.authUserId || '').trim();
      const name = String(nextIdentity?.name || authState.user?.fullName || authState.user?.name || '').trim();

      if (!userId || !name) {
        setError('User ID and name are required to start a video session');
        setStatus('error');
        return false;
      }

      if (!authState.authUserId || userId !== authState.authUserId) {
        setError('Stream user ID must match the authenticated user');
        setStatus('error');
        return false;
      }

      setStatus('connecting');
      setError('');

      try {
        const rawImage = nextIdentity?.image || authState.user?.profileImage || '';
        const safeImage = sanitizeStreamImage(rawImage);

        const user = {
          id: userId,
          name,
          ...(safeImage ? { image: safeImage } : {})
        };

        const tokenProvider = async () => {
          console.log('[stream-session] requesting stream token', { userId: user.id });
          return fetchStreamToken(user, authState.token);
        };

        const nextClient = await getOrCreateStreamClient({
          apiKey: API_KEY,
          user,
          tokenProvider
        });

        setIdentity(user);
        clientRef.current = nextClient;
        setClient(nextClient);
        setStatus('ready');
        console.log('[stream-session] stream client ready', { userId: user.id });
        return nextClient;
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : 'Failed to start Stream session');
        setStatus('error');
        return false;
      }
    },
    [readAuthState]
  );

  const joinCall = useCallback(
    async (overrides = {}, clientOverride = null) => {
      const activeClient = clientOverride || clientRef.current;

      if (!activeClient) {
        setError('Create a video session before joining a call');
        return false;
      }

      const nextCallType = overrides.callType || callType || DEFAULT_CALL_TYPE;
      const nextCallId = String(overrides.callId || callId || '').trim();

      if (!nextCallId) {
        setError('Call ID is required');
        return false;
      }

      if (joinPromiseRef.current) {
        return joinPromiseRef.current;
      }

      const activeCall = callRef.current;
      if (activeCall && activeCall.type === nextCallType && activeCall.id === nextCallId) {
        console.log('[stream-session] reusing active call', { callType: nextCallType, callId: nextCallId });
        setStatus('in-call');
        return true;
      }

      setStatus('joining');
      setError('');

      joinPromiseRef.current = (async () => {
        try {
          if (activeCall && (activeCall.type !== nextCallType || activeCall.id !== nextCallId)) {
            await safeLeaveCall('switch-call');
          }

          const nextCall = activeClient.call(nextCallType, nextCallId);
          console.log('[stream-session] call.join start', { callType: nextCallType, callId: nextCallId });
          await nextCall.join({ create: true });
          console.log('[stream-session] call.join success', { callType: nextCallType, callId: nextCallId });

          callRef.current = nextCall;
          setCall(nextCall);
          setCallType(nextCallType);
          setCallId(nextCallId);
          setStatus('in-call');
          return true;
        } catch (joinError) {
          console.error('[stream-session] call.join failed', {
            callType: nextCallType,
            callId: nextCallId,
            message: joinError instanceof Error ? joinError.message : joinError
          });
          setError(joinError instanceof Error ? joinError.message : 'Failed to join the call');
          setStatus('ready');
          return false;
        } finally {
          joinPromiseRef.current = null;
        }
      })();

      return joinPromiseRef.current;
    },
    [callId, callType, safeLeaveCall]
  );

  const leaveCall = useCallback(async () => {
    if (!callRef.current) {
      return;
    }

    setStatus('leaving');
    await safeLeaveCall('leave-action');
    setStatus(clientRef.current ? 'ready' : 'idle');
  }, [safeLeaveCall]);

  const ensureSessionAndJoin = useCallback(
    async ({ identity: nextIdentity, callId: nextCallId, callType: nextCallType }) => {
      const readyClient = await startSession(nextIdentity);
      if (!readyClient) {
        return false;
      }

      return joinCall({ callId: nextCallId, callType: nextCallType }, readyClient);
    },
    [joinCall, startSession]
  );

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
      ensureSessionAndJoin,
      leaveCall,
      disconnect,
      isConnected: Boolean(client),
      isInCall: Boolean(call)
    }),
    [client, call, identity, callId, callType, status, error, startSession, joinCall, ensureSessionAndJoin, leaveCall, disconnect]
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