import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: CLOUDNARY_CLOUD_NAME,
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
        // now the file has been uploaded successfully

        console.log("File is Uploaded on cloudinary", response.url);

        return response


    } catch (error) {
fs.unlinkSync(localFile)
// the code will resove the file which is temporary saved in local when operation get failed
return null;
    }
}


export {uploadOnCloudinary}

