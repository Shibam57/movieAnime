import axios from 'axios';
import { SESSION_KEY, paths, validSession, needsRefresh } from '../utils/contracts.js';
const baseURL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const options = { baseURL, timeout: 30000, withCredentials: false };
const raw = axios.create(options);
const api = axios.create(options);
let current = null;
try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (validSession(saved))
        current = saved;
    localStorage.removeItem('admintoken');
    localStorage.removeItem('admin');
}
catch { /* storage unavailable */ }
let version = 0, refreshing = null;
const listeners = new Set();
export function getSession() { return current; }
export function subscribeSession(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function publish(value) { current = value; try {
    if (value)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else
        sessionStorage.removeItem(SESSION_KEY);
}
catch { /* in-memory fallback */ } listeners.forEach(fn => fn()); }
export function setSession(value) { version++; refreshing = null; publish(validSession(value) ? value : null); }
export function clearSession() { setSession(null); }
export async function refreshSession() {
    if (refreshing)
        return refreshing;
    if (!current)
        throw new Error('Sign in required');
    const before = current, generation = version;
    const task = (async () => { try {
        const { data } = await raw.post(paths.refresh, { refreshToken: before.refreshToken });
        if (generation !== version)
            throw new Error('Session changed');
        if (!validSession(data?.data))
            throw new Error('Invalid refresh response');
        publish({ ...before, ...data.data });
        return current.accessToken;
    }
    catch (error) {
        if (generation === version && [400, 401, 403].includes(error.response?.status))
            clearSession();
        throw error;
    } })();
    refreshing = task;
    try {
        return await task;
    }
    finally {
        if (refreshing === task)
            refreshing = null;
    }
}
api.interceptors.request.use(async (config) => {
    if (config.publicRequest)
        return config;
    if (!current)
        throw new Error('Sign in required');
    const generation = version;
    if (needsRefresh(current.accessToken))
        await refreshSession();
    if (!current || generation !== version)
        throw new Error('Session changed');
    config.headers.set('Authorization', `Bearer ${current.accessToken}`);
    config.sessionVersion = generation;
    return config;
});
api.interceptors.response.use(res => { if (!res.config.publicRequest && res.config.sessionVersion !== version)
    throw new Error('Session changed'); return res; }, async (error) => {
    const config = error.config;
    if (error.response?.status !== 401 || !config || config.publicRequest || !current || config.sessionVersion !== version)
        throw error;
    if (config.retried) {
        clearSession();
        throw error;
    }
    config.retried = true;
    if (config.headers.get('Authorization') === `Bearer ${current.accessToken}`)
        await refreshSession();
    return api(config);
});
export async function login(credentials) { const { data } = await raw.post(paths.login, credentials); if (!validSession(data?.data) || !data.data.admin)
    throw new Error('Unexpected login response; deploy the revised backend'); setSession(data.data); return data.data.admin; }
export async function logout() { try {
    if (current)
        await api.post(paths.logout, {});
}
finally {
    clearSession();
} }
export async function registerAdmin(fields, key) { if (current)
    return api.post(paths.register, fields); return raw.post(paths.register, fields, { headers: { 'X-Admin-Registration-Key': key } }); }
export default api;
