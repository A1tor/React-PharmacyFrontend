// Tiny API + auth layer. Every authenticated request goes through apiFetch.
const KEY = 'auth';

function read() {
  try {
    const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const getAuth = () => read();
export const getToken = () => { const a = read(); return a && a.token; };

export function setAuth(auth, remember) {
  const a = JSON.stringify(auth);
  (remember ? localStorage : sessionStorage).setItem(KEY, a);
  (remember ? sessionStorage : localStorage).removeItem(KEY);
}

export function clearAuth() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

export async function apiFetch(path, opts = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...opts,
    headers: {
      Accept: 'application/json',
      ...(opts.body ? { 'Content-Type': 'application/json' } : null),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const authenticate = (username, password) =>
  apiFetch('/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
