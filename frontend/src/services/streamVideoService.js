const STREAM_TOKEN_ENDPOINT = import.meta.env.VITE_STREAM_TOKEN_ENDPOINT;

export async function fetchStreamToken(user, authToken = '') {
  if (!STREAM_TOKEN_ENDPOINT) {
    throw new Error('VITE_STREAM_TOKEN_ENDPOINT is not configured');
  }

  const userId = String(user?.id || '').trim();

  if (!userId) {
    throw new Error('Cannot fetch Stream token without a valid user id');
  }

  console.log('[stream-token] requesting token', {
    endpoint: STREAM_TOKEN_ENDPOINT,
    userId,
    hasAuthToken: Boolean(authToken)
  });

  const response = await fetch(STREAM_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken
        ? {
            Authorization: `Bearer ${authToken}`
          }
        : {})
    },
    body: JSON.stringify({
      userId,
      name: user.name,
      image: user.image || ''
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Failed to fetch Stream token');
  }

  const data = await response.json();
  const token = data.token || data.streamToken || data.accessToken;

  if (!token) {
    throw new Error('Stream token response is missing a token');
  }

  console.log('[stream-token] token issued', { userId });

  return token;
}