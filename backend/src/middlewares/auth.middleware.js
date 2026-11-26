const ApiError = require("../utils/ApiError");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");

    let token = req.cookies?.accessToken;

    if (!token && authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
    }

    if (!token || typeof token !== "string" || !token.trim()) {
        throw new ApiError(401, "Unauthorized request - Token missing");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }

        throw new ApiError(401, "Invalid access token");
    }

    if (!decodedToken?._id) {
        throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "User associated with token not found");
    }

    req.user = user;

    next();
});

module.exports = verifyJWT;