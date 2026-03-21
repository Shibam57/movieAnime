const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Admin = require("../models/admin.model");


const generateAccessAndRefreshToken = async(adminId)=>{
    try {
        const admin = await Admin.findById(adminId)

        if(!admin){
            throw new ApiError(404, "User not found")
        }

        const accessToken = await admin.generateAccessToken();
        const refreshToken = await admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Failed to generate access token")
    }
}

const registerAdmin = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body

    if(!name || !email){
        throw new ApiError(400, "All fields are required")
    }

    if (!password || password.length < 8) {
        throw new ApiError(400, "minimum length is 8");
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        throw new ApiError(400, "Admin already exists with this email");
    }

    const admin = await Admin.create({
        name,
        email,
        password
    })

    const createdAdmin = await Admin.findById(admin._id).select("-password")

    if(!createdAdmin){
        throw new ApiError(500, "User creation failed")
    }

    return res.status(200)
    .json(new ApiResponse(200, createdAdmin, "Admin registered successfully"))
})

const loginAdmin = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const admin = await Admin.findOne({ email });
    if(!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isMatch = await admin.isPasswordMatch(password)
    if(!isMatch){
        throw new ApiError(401, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(admin?._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    const options={
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {admin: loggedInAdmin, accessToken, refreshToken}, "Admin logged in successfully"))
})

const logoutAdmin = asyncHandler(async(req, res)=>{
    await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $unset: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Admin logged out successfully"))
})

const getCurrentAdmin = asyncHandler(async(req, res)=>{
    if(!req.admin?._id){
        throw new ApiError(401, "Unauthorized request - User not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, req.admin, "Current admin fetched successfully"))
})

module.exports = {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin
}