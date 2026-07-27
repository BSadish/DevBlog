import { Post } from "../model/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";


export const createPost = asyncHandler(async (req, res) => {

    const { title, content, catagory, tags } = req.body


    if ([title, content].some(field => (field).trim() === "")) {
        throw new ApiError(401, "Content on all field are required")
    }

    const user = req.user
    if (!user) {
        throw new ApiError(401, "Unauthorized")
    }
    if (user.isDeleted) {
        throw new ApiError(403, "Your accound has been deleted")
    }
    // const coverImagePath=req.file?.path
    // if(!coverImagePath){
    //     throw new ApiError(401,"Image path not found")
    // }
    // const coverImage=await uploadOnCloudinary(coverImagePath)
    // if(!coverImage?.url){
    //     throw new ApiError(401,"Image not uploaded on cloudinary")
    // }


    const userPost = await Post.create({
        title,
        content,
        // coverImage:coverImage.url,
        catagory,
        tags,
        author: req.user._id


    })

    return res.status(200)
        .json(new ApiResponse(200, userPost, "User created the post"))

})

export const getPostProfile = asyncHandler(async (req, res) => {

    const posts = await Post.find().populate("author", "_id username")

    return res.status(200)
        .json(new ApiResponse(200, posts, "Get the post user"))


})

export const getPostById = asyncHandler(async (req, res) => {

    const { postId } = req.params;
    console.log(req.params.postId)

    const post = await Post.findOneAndUpdate(
        postId,
        {
            $inc: { views: 1 }
        },
        {
            returnDocument: "after"
        }

    )
    if (!post) {
        throw new ApiError(404, "Post not found")
    }
    return res.status(200)
        .json(new ApiResponse(200, post, "Fetched post"))
})

export const getAllPosts = asyncHandler(async (req, res) => {

    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 5
    if (page < 1) {
        page = 1
    }
    if (limit < 1) {
        limit = 1
    }
    if(limit>50){
        limit=50
    }

   
    const search = req.query.search || ""


    const filter = {}
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
        ]
    }

    const totalPosts = await Post.countDocuments(filter)

    

    const totalPages = Math.ceil(totalPosts / limit);

    const hasNextPage=page<totalPages
    const hasPreviousPage=page>1
    const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    return res.status(200)
        .json(new ApiResponse(200, {
            posts,
            currentPage: page,
            totalPosts,
            totalPages,
            limit,
            hasNextPage,
            hasPreviousPage
        }, "Data Fetched successfully"))
})