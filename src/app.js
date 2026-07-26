import express from "express"
import userRouter from "./route/user.route.js"
import cookieParser from "cookie-parser";
import postRouter from "./route/post.route.js"
const app=express();

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
app.use("/api/v1/blog",userRouter)
app.use("/api/v1/blog",postRouter)


export {app}