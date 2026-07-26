import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

import { ApiError } from "./ApiError.js";
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});


const uploadOnCloudinary = async (localFile) => {
    try {
       
        if (!localFile) return null
 
        //now i am uploading file in cloudnary
        const response = await cloudinary.uploader.upload(localFile, {
            resource_type: "auto"
        });
       
        console.log(response)
        // now the file has been uploaded successfully

        console.log("File is Uploaded on cloudinary", response.url);

        fs.unlinkSync(localFile)
        return response


    } catch (error) {
       
            fs.unlinkSync(localFile)
        
console.log(error)
        return null;
    }
}


export { uploadOnCloudinary }

