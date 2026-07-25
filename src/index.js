import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/db.js";

dotenv.config({path:"./.env"})

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Mongodb sever running on port",process.env.PORT)
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed",err)
    process.exit(1)
})