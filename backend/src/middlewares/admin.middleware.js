const ApiError = require("../utils/ApiError");
const Admin = require("../models/admin.model");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        let token = req.cookies?.accessToken;

        if (!token && authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token || typeof token !== "string" || token.trim() === "") {
            throw new ApiError(401, "Unauthorized request - Token missing or malformed");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

        if (!admin) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

module.exports = verifyAdminJWT;