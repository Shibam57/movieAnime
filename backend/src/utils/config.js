const ApiError = require('./ApiError');
const production = () => process.env.NODE_ENV === 'production';
const origins = () => (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174').split(',').map(x => x.trim().replace(/\/$/, '')).filter(Boolean);
function validateEnv() {
    const required = ['MONGODB_URL','ACCESS_TOKEN_SECRET','REFRESH_TOKEN_SECRET','ACCESS_TOKEN_EXPIRY','REFRESH_TOKEN_EXPIRY','CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET'];
    if (production()) required.push('CORS_ORIGIN');
    const missing = required.filter(key => !process.env[key]?.trim());
    if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    if (process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET) throw new Error('JWT secrets must be different');
    if (production() && origins().some(x => !/^https:\/\//.test(x))) throw new Error('Production CORS origins must be HTTPS');
}
function cookieOptions() { return { httpOnly: true, secure: production(), sameSite: production() ? 'none' : 'lax', path: '/' }; }
// Protect cookie-authenticated browser writes from other origins; non-browser bearer clients are supported.
function checkOrigin(req, res, next) {
    const origin = req.get('Origin');
    if (origin && !['GET','HEAD','OPTIONS'].includes(req.method) && !origins().includes(origin)) return next(new ApiError(403, 'Origin not allowed'));
    next();
}
module.exports = { production, origins, validateEnv, cookieOptions, checkOrigin };
