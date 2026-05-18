const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function getCurrentUserProfile() {
  return request('/api/user/profile');
}

export function updateCurrentUserProfile(payload) {
  return request('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}
