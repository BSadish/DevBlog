import rateLimit from "express-rate-limit";
import redisClient from "../db/redis";
import {RedisStore} from "rate-limit-redis"
const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5,              // limit each IP to 5 requests per windowMs
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true, // adds RateLimit-* headers to responses
    legacyHeaders: false,  // disables the old X-RateLimit-* headers

    store: new RedisStore({
        sendCommand:(...args)=>redisClient.call(...args)
    })
});

app.use(limiter);