const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://syncly-3nm4.onrender.com';

export function buildOAuthUrl(provider) {
  return `${API_BASE_URL}/api/auth/${provider}`;
}
