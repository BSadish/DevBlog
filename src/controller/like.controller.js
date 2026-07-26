import { Like } from "../model/like.model.js";
import { Post } from "../model/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";


export const toggleLike=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const userId=req.user._id

    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(401,"Post details not found")
    }

    const existingLike=await Like.findOne({post:postId,user:userId})

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200)
        .json(new ApiResponse(200,{},"Post Unliked"))
    }

    const newLike=await Like.create({
        post:postId,
        user:userId
    })

    return res.status(201)
    .json(new ApiResponse(201, newLike, "Post Liked"))
})