// import "dotenv/config"; 
// import Redis from "ioredis";

// const redisClient=new Redis({
//     username:"default",
//     password:process.env.REDIS_PASSWORD,
//     host:process.env.REDIS_HOST,
//     port:process.env.REDIS_PORT
// })






// redisClient.on("connect",()=>console.log("Connecting to Redis"))
// redisClient.on("ready", () => console.log("Redis is ready....."));
// redisClient.on("error", (err) => console.log("Redis Error..", err));
// redisClient.on("close", () => console.log("Redis connection is closed....."));

// export default redisClient

// const { createClient } = require("redis");
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

(async () => {
    await redisClient.connect();
})();

export default redisClient