import { User } from "../model/user.model.js"
import { ApiError } from "../util/ApiError.js"
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {

    
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Token not found invalide request")
        }
        try {
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
        console.log(error)
throw new ApiError(401,error.message)
    }
}