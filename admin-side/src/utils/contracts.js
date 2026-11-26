export const SESSION_KEY = 'movieanime.admin.session.v1';
export const paths = { login: '/api/v1/admins/admin-login', refresh: '/api/v1/admins/refresh-token', logout: '/api/v1/admins/admin-logout', profile: '/api/v1/admins/admin-profile', register: '/api/v1/admins/admin-register', stats: '/api/v1/dashboard/stats', movies: '/api/v1/movies', series: '/api/v1/series/all-series', payments: '/api/v1/payments/alladmin-payments', notifications: '/api/v1/notifications' };
export function validSession(value) { return Boolean(value && typeof value.accessToken === 'string' && value.accessToken && typeof value.refreshToken === 'string' && value.refreshToken); }
export function tokenExpiry(token) { try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Number(payload.exp) * 1000 || 0;
}
catch {
    return 0;
} }
export function needsRefresh(token, now = Date.now()) { return tokenExpiry(token) <= now + 30000; }
export function message(error) { return error?.response?.data?.message || error?.message || 'Request failed'; }
export function arrayData(value) { if (!Array.isArray(value))
    throw new Error('Unexpected list response from backend'); return value; }
export function catalogData(data, kind, limit) { if (kind === 'movie') {
    const items = arrayData(data?.movies);
    if (!Number.isInteger(data.totalPages) || data.totalPages < 0)
        throw new Error('Invalid pagination response');
    return { items, hasNext: null, totalPages: data.totalPages };
} const items = arrayData(data); return { items, hasNext: items.length === limit, totalPages: null }; }
export function money(amount, currency = 'INR') { if (amount == null || !Number.isFinite(Number(amount)))
    return '—'; try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(amount));
}
catch {
    return `${currency} ${amount}`;
} }
export function dateLabel(value) { const date = new Date(value); return value && !Number.isNaN(date.valueOf()) ? date.toLocaleString('en-IN') : '—'; }
export function paidPrice(paid, value) { if (!paid)
    return 0; const n = Number(value); if (!Number.isFinite(n) || n < 1 || !Number.isSafeInteger(Math.round(n * 100)) || Math.abs(n * 100 - Math.round(n * 100)) > 1e-6)
    throw new Error('Paid content requires an INR price of at least ₹1, with up to two decimal places.'); return n; }
const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo'];
export function validateFile(file, kind, maxMB = 100) { if (!file || !file.size)
    throw new Error(`${kind} file is required`); if (!(kind === 'video' ? videoTypes : imageTypes).includes(file.type))
    throw new Error(`Unsupported ${kind} file type`); if (file.size > maxMB * 1024 * 1024)
    throw new Error(`${kind} exceeds ${maxMB} MB`); }
export function validId(value) { return /^[a-f0-9]{24}$/i.test(value || ''); }
