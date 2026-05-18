const STREAM_TOKEN_ENDPOINT = import.meta.env.VITE_STREAM_TOKEN_ENDPOINT;

export async function fetchStreamToken(user) {
  if (!STREAM_TOKEN_ENDPOINT) {
    throw new Error('VITE_STREAM_TOKEN_ENDPOINT is not configured');
  }

  const response = await fetch(STREAM_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: user.id,
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

  return token;
}