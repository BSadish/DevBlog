import { ApiError } from "../util/ApiError";
import { asyncHandler } from "../util/asyncHandler";


export const userPost=asyncHandler(async(req,res)=>{

const {title, content, tags, author, views}=req.body
const {coverImage}=req.file

if([title, content,author,tags].some(field=>field.trim()==="")){
    throw new ApiError(401,"Content on all field are required")
}




})