const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const asyncHandler = require('../utils/asyncHandler');
const { readToken, verifyToken } = require('../utils/auth');
module.exports = asyncHandler(async (req, res, next) => {
    for (const [role, Model] of [['admin', Admin], ['user', User]]) {
        const token = readToken(req, role);
        if (!token) continue;
        let payload;
        try { payload = verifyToken(token, role); } catch { continue; }
        const account = await Model.findById(payload._id).select('-password -refreshToken');
        if (account) req[role] = account;
        // When both cookies exist, keep both identities; explicit Bearer overrides cookies.
    }
    next();
});
