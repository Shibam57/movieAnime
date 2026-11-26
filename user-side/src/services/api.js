import axios from 'axios';
const baseURL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const config = { baseURL, timeout: 25000, withCredentials: false };
const api = axios.create(config);
const bare = axios.create(config);
const KEY = 'movieanime.user.session.v2';
let tokens = null;
try {
  const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
  if (typeof saved?.accessToken === 'string' && typeof saved?.refreshToken === 'string') tokens = saved;
  localStorage.removeItem('token'); localStorage.removeItem('user');
} catch { /* Storage may be disabled; in-memory session still works. */ }
let generation = 0;
let refreshPromise = null;
export const hasSession = () => Boolean(tokens?.accessToken);
function persist(next) {
  tokens = next;
  try { if (next) sessionStorage.setItem(KEY, JSON.stringify(next)); else sessionStorage.removeItem(KEY); } catch { /* in-memory fallback */ }
}
export function setSession(next) {
  if (typeof next?.accessToken !== 'string' || typeof next?.refreshToken !== 'string') throw new Error('Login response is missing tokens');
  generation++; refreshPromise = null;
  persist({ accessToken: next.accessToken, refreshToken: next.refreshToken });
}
export function clearSession() { generation++; refreshPromise = null; persist(null); window.dispatchEvent(new Event('movieanime:session-ended')); }
api.interceptors.request.use(config => {
  if (tokens?.accessToken && !config.skipAuth) config.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  config.sessionGeneration = generation;
  return config;
});
async function refresh() {
  if (!tokens?.refreshToken) throw new Error('Please log in again');
  if (!refreshPromise) {
    const started = generation;
    const current = tokens.refreshToken;
    const task = bare.post('/api/v1/users/refresh-token', { refreshToken: current }).then(({ data }) => {
      if (started !== generation) throw new Error('Session changed');
      const next = data?.data;
      if (typeof next?.accessToken !== 'string' || typeof next?.refreshToken !== 'string') throw new Error('Invalid refresh response');
      persist({ accessToken: next.accessToken, refreshToken: next.refreshToken });
      return next.accessToken;
    }).catch(error => {
      if (started === generation && [400, 401, 403].includes(error.response?.status)) clearSession();
      throw error;
    }).finally(() => { if (refreshPromise === task) refreshPromise = null; });
    refreshPromise = task;
  }
  return refreshPromise;
}
api.interceptors.response.use(response => response, async error => {
  const request = error.config;
  if (!request || request.skipAuth || request.signal?.aborted || request.sessionGeneration !== generation || error.response?.status !== 401 || !tokens) throw error;
  if (request.retried) { clearSession(); throw error; }
  request.retried = true;
  // Another concurrent request may already have refreshed the rejected token.
  if (request.headers.get('Authorization') === `Bearer ${tokens.accessToken}`) await refresh();
  if (request.sessionGeneration !== generation || request.signal?.aborted) throw error;
  return api(request);
});
export default api;
