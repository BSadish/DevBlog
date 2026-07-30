
import dotenv from "dotenv"
dotenv.config({path:"./.env"})

import { app } from "./app.js";
import { connectDB } from "./db/db.js";



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