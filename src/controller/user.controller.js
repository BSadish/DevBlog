import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import { Post } from "../model/post.model.js"
import jwt from "jsonwebtoken"
import redisClient from "../db/redis.js";

export const generateAccessAndRefreshToken = async function (userid) {
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message || "Error occurs while generateing access and refrehs token")
    }

}


export const userRegister = asyncHandler(async (req, res) => {

    // console.log("Hello User")
    const { username, password, email, bio, role } = req.body
    // console.log(req.body.email)
    if ([username, password, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All field must be filled")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with current name and email already existed")
    }



    const user = await User.create({
        username,
        password,
        email,
        bio,
        role
    })
    if (!user) {
        throw new ApiError(400, "Field are missing to be inserted")
    }

    return res.status(201)
        .json(new ApiResponse(201, user, "User is registered successfully"))

})


export const userLogin = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
  
    const key = `login_limit:${email}`
   
    if ((!username && !email) || !password) {
        throw new ApiError(401, "The form should not be empty")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user || user.isDeleted) {
        throw new ApiError(401, "User with such credentials is not present")
    }



    const ispasswordValid = await user.isPasswordCorrect(password)

    if (!ispasswordValid) {
        const attempts = await redisClient.incr(key)

        if (attampts === 1) {
            await redisClient.expire(key, 60 * 15)
        }
        return res.status(401).json({ message: "Invalid credentials" });
    }

    await redisClient.del(key);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const logIn = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, logIn, "User login successfully"))

})


export const userProfile = asyncHandler(async (req, res) => {


    const user = await User.find({})

    if (!user || user.isDeleted == true) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, user, "List of users"))


})

export const updateUserProfile = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file path not found");

    }
    //uploading to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    console.log(avatar)
    if (!avatar?.url) {
        throw new ApiError(400, "Avatar file is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200)
        .json(new ApiResponse(200, updatedUser, "Image uploaded successfully"))
})


export const updateUser = asyncHandler(async (req, res) => {

    const { username, email, password, bio } = req.body
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio) updateFields.bio = bio
    if (password) updateFields.password = password;
    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
            $set: updateFields

        },
        { new: true }

    ).select("-password -refreshToken")

    return res.status(200)
        .json(new ApiResponse(200, updatedUser, "User details updated successfully"))
})

export const deleteUser = asyncHandler(async (req, res) => {


    const deletedUser = await User.findByIdAndDelete(req.user._id, {
        isDeleted: true
    })
    if (deletedUser) {
        throw new ApiError(404, "User not found");
    }
    return res.status(201)
        .json(new ApiResponse(201, deletedUser, "User deleted successfully"))

})

export const newrefreshToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingToken) {
        throw new ApiError(401, "RrefreshToken Missing")
    }


    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decoded) {
        throw new ApiError(401, "Invalid refreshToken")
    }

    const user = await User.findById(decoded._id)


    if (incomingToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or already used")

    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"))
})


export const logOut = asyncHandler(async (req, res) => {


    const user = await User.findByIdAndUpdate(req.user._id,

        {

            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true,

    }
    console.log(user)
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User looged out Successfully"))
})
