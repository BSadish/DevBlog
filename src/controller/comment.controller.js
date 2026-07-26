import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

import { Post } from "../model/post.model.js";


export const commentOnPost=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    const {comment}=req.body
   const userId=req.user._id
console.log(postId)
   if((comment).trim()===""){
    throw new ApiError(401,"No comment found")
   }

   const post=await Post.findById(postId)
   if(!post){
    throw new ApiError(401,"Post details not found")
   }


    const userComment=await User.create({
        comment,
        user:userId,
        post:postId
    })

    return res.status(200)
    .json(new ApiResponse(200,userComment,"Comment successfully added to post"))

})