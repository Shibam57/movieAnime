const ApiError = require("../utils/ApiError");
const Admin = require("../models/admin.model");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");


const optionalVerifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        let token = req.cookies?.accessToken;

        if (!token && authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) return next(); // no token = public user

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");

        if (admin) req.admin = admin;
        next();
    } catch (err) {
        next(); // if invalid token, treat as public user
    }
});

module.exports = optionalVerifyAdminJWT