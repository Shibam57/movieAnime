const ApiError = require('../utils/ApiError');
module.exports = function rateLimit(max = 30, windowMs = 15 * 60 * 1000) {
    const counters = new Map();
    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        let record = counters.get(key);
        if (!record || record.until <= now) {
            if (counters.size >= 10000) {
                for (const [k, v] of counters) if (v.until <= now) counters.delete(k);
                if (counters.size >= 10000) return next(new ApiError(429, 'Too many requests; try again later'));
            }
            record = { count: 0, until: now + windowMs }; counters.set(key, record);
        }
        if (++record.count > max) {
            res.set('Retry-After', String(Math.ceil((record.until - now) / 1000)));
            return next(new ApiError(429, 'Too many requests; try again later'));
        }
        next();
    };
};
