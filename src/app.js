
import express from "express"
import userRouter from "./route/user.route.js"
import cookieParser from "cookie-parser";
import postRouter from "./route/post.route.js"
import commentRouter from "./route/comment.route.js"
import userLike from "./route/like.route.js"
import { errorHandler } from "./middleware/erro.middleware.js";

const app=express();


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())


app.use("/api/v1/blog/user",userRouter)
app.use("/api/v1/blog/post",postRouter)
app.use("/api/v1/blog/comment",commentRouter)
app.use("/api/v1/blog/like",userLike)

app.use(errorHandler)
export {app}