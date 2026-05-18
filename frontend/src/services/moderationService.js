const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://syncly-3nm4.onrender.com';

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

export function submitReport(payload) {
  return request('/api/moderation/report', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getReportHistory() {
  return request('/api/moderation/history');
}

export function getAdminReports() {
  return request('/api/moderation/admin/reports');
}

export function reviewReport(payload) {
  return request('/api/moderation/admin/reports/review', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function suspendUser(payload) {
  return request('/api/moderation/admin/users/suspend', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}