import { User } from "../model/user.model"
import { ApiError } from "../util/ApiError"
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {

    try {
        const token = req.cookie.accessToken || req.header("Authorization")?.replace("Breaer", "")
        if (!token) {
            throw new ApiError(401, "Token not found invalide request")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            throw new ApiError(401, "Invalide access Token")
        }
        const user = await User.findById(decoded?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"User not found")
        }
        req.user = user
        next()
    } catch (error) {
throw new ApiError(401,error.message)
    }
}