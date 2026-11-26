const ApiError = require('./ApiError');
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function searchText(value) { if (typeof value !== 'string' || value.length > 100) throw new ApiError(400, 'Invalid search query'); return escapeRegex(value.trim()); }
function pagination(page, limit) { const p = Number(page), l = Number(limit); if (!Number.isSafeInteger(p) || p < 1 || p > 100000 || !Number.isSafeInteger(l) || l < 1) throw new ApiError(400, 'Invalid pagination'); return [p, Math.min(l,100)]; }
function sortField(value) { return ['createdAt','updatedAt','title','price','duration','views'].includes(value) ? value : 'createdAt'; }
function pick(body, fields) { return Object.fromEntries(fields.filter(k => Object.hasOwn(body || {}, k)).map(k => [k, body[k]])); }
function bool(value) { return value === true || value === 'true'; }
function priceValue(value, paid) {
    const n = value === undefined || value === "" ? 0 : Number(value);
    if (!Number.isFinite(n) || n < 0 || (paid && n < 1) || Math.abs(n * 100 - Math.round(n * 100)) > 1e-6 || !Number.isSafeInteger(Math.round(n * 100))) throw new ApiError(400, "Invalid INR price");
    return n;
}
module.exports = { priceValue, escapeRegex, searchText, pagination, sortField, pick, bool };
