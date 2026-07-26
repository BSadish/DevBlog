import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import {Comment} from "../model/comment.model.js"
import { Post } from "../model/post.model.js";


export const commentOnPost=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {comment}=req.body
   const userId=req.user._id
console.log(id)
   if((comment).trim()===""){
    throw new ApiError(401,"No comment found")
   }
// console.log(comment)
   const post=await Post.findById(id)
   if(!post){
    throw new ApiError(401,"Post details not found")
   }


    const userComment=await Comment.create({
        comment,
        user:userId,
        post:id
    })

    return res.status(200)
    .json(new ApiResponse(200,userComment,"Comment successfully added to post"))

})