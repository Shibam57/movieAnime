const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
module.exports = (req, res, next) => {
    if (req.admin) return next();
    const secret = process.env.ADMIN_REGISTRATION_KEY;
    const supplied = req.get('X-Admin-Registration-Key');
    if (secret && supplied) {
        const a = Buffer.from(secret), b = Buffer.from(supplied);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) return next();
    }
    next(new ApiError(403, 'Admin registration is restricted'));
};
