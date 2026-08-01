import rateLimit from "express-rate-limit";
import redisClient from "../db/redis.js";
import {RedisStore} from "rate-limit-redis"
// export const limiter = rateLimit({
//     windowMs: 10*1000, // 10 seconds
//     max: 5,              // limit each IP to 5 requests per windowMs
//     message: { message: "Too many requests, please try again later." },
//     standardHeaders: true, // adds RateLimit-* headers to responses
//     legacyHeaders: false,  // disables the old X-RateLimit-* headers

//     store: new RedisStore({
//         sendCommand:(...args)=>redisClient.call(...args),
//         prefix:"login_limit:",
//     })
// });


export const rateLimiter=async(req,res,next)=>{
  
const MAX_TIME=5
const MAX_LOGIN_LIMIT=60*15

     const id=req.body.email
  
     const key=`login_limit:${id}`
     
  try {
     const attamps=await redisClient.get(key)
     
     if(parent(attamps,10)>=MAX_TIME){
         return res.status(409,{message:"Too many request"})
     }
     next()
   } catch (error) {
    return res.status(400).json({message:error.message})
    next()
   }
}
