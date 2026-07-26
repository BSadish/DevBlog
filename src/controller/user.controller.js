import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";


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


    const { username, password, email, avatar, bio } = req.body
    // console.log(req.body.email)
    if ([username, password, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(401, "All field must be filled")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(401, "User with current name and email already existed")
    }

    const user = await User.create({
        username,
        password,
        email,
        avatar,
        bio
    })
    if (!user) {
        throw new ApiError(401, "Field are missing to be inserted")
    }

    return res.status(201)
        .json(new ApiResponse(201, "User is registered successfully"))

})


export const userLogin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email) {
        throw new ApiError(401, "The form should not be empty")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(401, "User with such credentials is not present")
    }



    const ispasswordValid = await user.isPasswordCorrect(password)
    if (!ispasswordValid) {
        throw new ApiError(401, "User password doesnot match")
    }

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

    return res.status(200)
        .json(new ApiResponse(200, req.user))

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
            $set: {
                updateFields
            }
        },
        { new: true }

    ).select("-password -refreshToken")

    return res.status(200)
        .json(new ApiResponse(200, updatedUser, "User details updated successfully"))
})

export const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.user._id)
    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }
    return res.status(201)
        .json(new ApiResponse(201, deleteUser, "User deleted successfully"))

})