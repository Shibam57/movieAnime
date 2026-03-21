const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
const {uploadOnCloudinary, deleteFromCloudinary} = require('../utils/cloudinary')
const User = require('../models/user.model')


const generateAccessRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(404, "User not found")
        }


        const accessToken = await user.generateAccessToken();

        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Failed to generate access token")
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, fullname, password} = req.body

    if([username, email, fullname, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email}]
    })

    if(existingUser){
        throw new ApiError(400, "Email already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar")
    }

    const user = await User.create({
        username,
        email,
        fullname, 
        password,
        avatar: avatar.secure_url
    })

    const createdUser = await User.findById(user?._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "User creation failed")
    }

    return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully."))
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    if([email, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "all fields are required")
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPassword = await user.isPasswordMatch(password);

    if(!isPassword){
        throw new ApiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessRefreshToken(user?._id)

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res)=>{
    if(!req.user?._id){
        return res.status(400).json({Message: "No user is currently logged in."})
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options= {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const {accessToken, newRefreshToken} = await generateAccessRefreshToken(user?._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid refreshtoken")
    }
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized request - User not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
}