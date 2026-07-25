import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";


export const generateAccessAndRefreshToken=async function(userid){
try {
    const user=await User.findById(userid)
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    return (accessToken, refreshToken)
} catch (error) {
    throw new ApiError(500, error.message || "Error occurs while generateing access and refrehs token")
}

}


export const userRegister=asyncHandler(async(req,res)=>{

const {username, password, eamil, avatar, bio}=req.body

if([username, password,eamil,bio].some(field=>field.trim()===""))
{
    throw new ApiError(401,"All field must be filled")
}

const existedUser=await User.findOne({
    $or:{username,email}
})
if(existedUser){
    throw new ApiError(401,"User with current name and email already existed")
}

const user=await User.create({
    username,
    password,
    email,
    avatar,
    bio
})
if(!user){
    throw new ApiError(401,"Field are missing to be inserted")
}

return res.status(201)
.json(new ApiResponse(201,"User is registered successfully"))

})


export const userLogin=asyncHandler(async(req,res)=>{
const {username, email, password}=req.body;
if(!username || !email){
    throw new ApiError(401,"The form should not be empty")
}

const existedUser=await User.findOne({
    $or:{username, email}
})
if(!existedUser){
    throw new ApiError(401,"User with such credentials is not present")
}

const user=await User.findById(existedUser._id)

const ispasswordValid=user.isPasswordCorrect(password)
if(!ispasswordValid){
    throw new ApiResponse(401,"User password doesnot match")
}

const {accessToken, refreshToken}=generateAccessAndRefreshToken(user._id)

const logIn=await User.findById(user._id).select("-password -refreshToken")

const options={
    httpOnly:true,
    secure:true
}

return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new ApiResponse(200,logIn,"User login successfully"))

})