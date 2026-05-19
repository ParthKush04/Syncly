import { StreamVideoClient } from '@stream-io/video-react-sdk';

let singletonClient = null;
let singletonUserId = '';
let createClientPromise = null;
let disconnectPromise = null;

function log(message, details = undefined) {
  if (details === undefined) {
    console.log(`[stream-client] ${message}`);
    return;
  }

  console.log(`[stream-client] ${message}`, details);
}

export function getCurrentStreamClient() {
  return singletonClient;
}

export function getCurrentStreamClientUserId() {
  return singletonUserId;
}

async function createClient({ apiKey, user, tokenProvider }) {
  const userId = String(user?.id || '').trim();

  if (!apiKey) {
    throw new Error('VITE_STREAM_API_KEY is not configured');
  }

  if (!userId) {
    throw new Error('Cannot initialize Stream client without a valid user id');
  }

  log('creating client', { userId });
  const client = new StreamVideoClient({
    apiKey,
    user,
    tokenProvider
  });

  singletonClient = client;
  singletonUserId = userId;
  log('client created', { userId });
  return client;
}

export async function disconnectStreamClient(reason = 'manual') {
  if (!singletonClient) {
    return;
  }

  if (disconnectPromise) {
    await disconnectPromise;
    return;
  }

  const activeClient = singletonClient;
  const activeUserId = singletonUserId;

  disconnectPromise = (async () => {
    try {
      log('disconnecting client', { userId: activeUserId, reason });
      await activeClient.disconnectUser();
      log('client disconnected', { userId: activeUserId, reason });
    } catch (error) {
      log('disconnect failed', { userId: activeUserId, reason, error: error?.message || error });
    } finally {
      if (singletonClient === activeClient) {
        singletonClient = null;
        singletonUserId = '';
      }
      disconnectPromise = null;
    }
  })();

  await disconnectPromise;
}

export async function getOrCreateStreamClient({ apiKey, user, tokenProvider }) {
  const targetUserId = String(user?.id || '').trim();

  if (!targetUserId) {
    throw new Error('Cannot initialize Stream client because user id is missing');
  }

  if (singletonClient && singletonUserId === targetUserId) {
    log('reusing existing client', { userId: targetUserId });
    return singletonClient;
  }

  if (createClientPromise) {
    const pendingClient = await createClientPromise;
    if (singletonClient && singletonUserId === targetUserId) {
      log('reusing client from pending creation', { userId: targetUserId });
      return pendingClient;
    }
  }

  if (singletonClient && singletonUserId !== targetUserId) {
    await disconnectStreamClient('switch-user');
  }

  createClientPromise = createClient({ apiKey, user, tokenProvider });

  try {
    return await createClientPromise;
  } finally {
    createClientPromise = null;
  }
}