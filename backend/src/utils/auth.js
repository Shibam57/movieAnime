const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ApiError = require('./ApiError');
const crypto = require('crypto');
function readToken(req, role) {
    const header = req.get('Authorization');
    if (header) return /^Bearer\s+(\S+)$/i.exec(header)?.[1] || null;
    return req.cookies?.[role === 'admin' ? 'adminAccessToken' : 'accessToken'];
}
function verifyToken(token, role, refresh = false) {
    if (!token || typeof token !== 'string') throw new ApiError(401, 'Token missing or malformed');
    let payload;
    try { payload = jwt.verify(token, process.env[refresh ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET'], { algorithms: ['HS256'] }); }
    catch (err) { throw new ApiError(401, err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'); }
    if (payload.role !== role || payload.type !== (refresh ? 'refresh' : 'access') || !mongoose.isObjectIdOrHexString(payload._id)) throw new ApiError(401, 'Invalid token payload');
    return payload;
}
function tokenHash(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
async function issueTokens(account) {
    const accessToken = await account.generateAccessToken();
    const refreshToken = await account.generateRefreshToken();
    return { accessToken, refreshToken };
}
module.exports = { readToken, verifyToken, tokenHash, issueTokens };
