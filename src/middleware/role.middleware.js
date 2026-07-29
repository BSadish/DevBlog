import { ApiError } from "../util/ApiError.js"
import { asyncHandler } from "../util/asyncHandler.js"


export const authorizeRole=asyncHandler((...allowedRole)=>{
    return (req,res,next)=>{
        if(!allowedRole instanceof req.user.role){
            throw new ApiError(401, "Invalid role requested")
        }
        next()
    }
})