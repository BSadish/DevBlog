import { Post } from "../model/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";


export const createPost=asyncHandler(async(req,res)=>{

const {title, content,author}=req.body


if([title,content].some(field=>(field).trim()==="")){
    throw new ApiError(401,"Content on all field are required")
}


const user=req.user
if(!user){
    throw new ApiError(401,"User is empty or not defined")
}


const userPost=await Post.create({
    title,
    content,
    author:req.user._id
    

})

return res.status(200)
.json(new ApiResponse(200,userPost,"User created the post"))

})

export const getPostProfile=asyncHandler(async(req,res)=>{

const currentUser=req.user
const postUser=await Post.find({author:currentUser._id})



return res.status(200)
.json(new ApiResponse(200,postUser,"Get the post user"))


})

export const getPostById=asyncHandler(async(req,res)=>{

const {postId}=req.params;
console.log(req.params.postId)

const post =await Post.findOneAndUpdate(
    postId,
    {
        $inc:{views:1}},
        {
            returnDocument:"after"
        }
    
)
if(!post){
    throw new ApiError(404,"Post not found")
}
return res.status(200)
.json(new ApiResponse(200,post,"Fetched post"))
})