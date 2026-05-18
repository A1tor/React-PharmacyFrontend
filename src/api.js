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

async function apiFetch(path, opts = {}) {
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

// Flat object -> ?a=1&b=2 (skips null/empty, supports arrays).
const qs = (params) => {
  const u = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null || v === '') return;
    Array.isArray(v) ? v.forEach(x => u.append(k, x)) : u.append(k, v);
  });
  const s = u.toString();
  return s ? `?${s}` : '';
};

// Internal glue used by the helpers below.
const request = (path, { method = 'GET', query, body } = {}) =>
  apiFetch(`${path}${qs(query)}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

// GET list — with paging/filter.   getAll('user', { page: 0, size: 10, username: 'john' })
export const getAll = (entity, query) => request(`/${entity}`, { query });

// GET one — by id.                  getOne('user', 5)
export const getOne = (entity, id) => request(`/${entity}/${id}`);

// POST / PUT / DELETE — create, update, delete.
//   send('user', 'POST',   { username, password })
//   send('user', 'PUT',    { id, username })
//   send('user', 'DELETE', null, 5)
export const send = (entity, method, body, id) =>
  request(id != null ? `/${entity}/${id}` : `/${entity}`, { method, body });

export const authenticate = (username, password) =>
  request('/auth/authenticate', { method: 'POST', body: { username, password } });
