import { ApiError } from "../util/ApiError.js"



export const authorizeRole=(...allowedRole)=>{
    return (req,res,next)=>{

        if(!req.user){
            throw new ApiError(401,"Unauthorized request")
        }
console.log(allowedRole)

        if(!allowedRole.includes(req.user.role)){
            throw new ApiError(403, "Not have permission to perfom this action")
        }
        next()
    }
}