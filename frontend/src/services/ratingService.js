const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function submitConversationRating(payload) {
  const response = await fetch(`${API_BASE_URL}/api/ratings/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit rating');
  }

  return data;
}