import express from "express"
import userRouter from "./route/user.route.js"
const app=express();

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use("/api/v1/blog",userRouter)


export {app}