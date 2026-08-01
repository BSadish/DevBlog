import { Post } from "../model/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import slugify from "slugify"
import redisClient from "../db/redis.js"

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

    const slug=slugify(title,{
        lower:true,
        strict:true
    })
  
   const exitstingslug=await Post.findOne({slug});
   if(exitstingslug){
    slug=`${slug}-${Date.now()}`;
   }

    const userPost = await Post.create({
        title,
        content,
        // coverImage:coverImage.url,
        catagory,
        slug,
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

    const { slug } = req.params;
    // const {posId}=req.params
//   console.log(req.params.slug)
// without slug there will be findbyIdAndUpdate
    const post = await Post.findOneAndUpdate(
        {slug:slug},

        {
            $inc: { views: 1 }
        },
        {
            new: true
        }

    )
    if (!post) {
        throw new ApiError(404, "Post not found")
    }
    return res.status(200)
        .json(new ApiResponse(200, post, "Fetched post"))
})

export const getAllPosts = asyncHandler(async (req, res) => {

const cachedata=await redisClient.get('post')
if(cachedata) return res.json(JSON.parse(cachedata))


    const mongodbData=await Post.find({})
    // console.log(mongodbData)
    await redisClient.set("post",JSON.stringify(mongodbData))
    await redisClient.expire('post',30)

    return res.status(200).json(mongodbData)





    // let page = parseInt(req.query.page) || 1
    // let limit = parseInt(req.query.limit) || 5
    // if (page < 1) {
    //     page = 1
    // }
    // if (limit < 1) {
    //     limit = 1
    // }
    // if (limit > 50) {
    //     limit = 50
    // }


    // const search = req.query.search || ""


    // const filter = {}
    // if (search) {
    //     filter.$or = [
    //         { title: { $regex: search, $options: "i" } },
    //         { content: { $regex: search, $options: "i" } },
    //         { tags: { $regex: search, $options: "i" } },
    //     ]
    // }

    // const totalPosts = await Post.countDocuments(filter)



    // const totalPages = Math.ceil(totalPosts / limit);

    // const hasNextPage = page < totalPages
    // const hasPreviousPage = page > 1
    // const posts = await Post.find(filter)
    //     .sort({ createdAt: -1 })
    //     .skip((page - 1) * limit)
    //     .limit(limit)

    // return res.status(200)
    //     .json(new ApiResponse(200, {
    //         posts,
    //         currentPage: page,
    //         totalPosts,
    //         totalPages,
    //         limit,
    //         hasNextPage,
    //         hasPreviousPage
    //     }, "Data Fetched successfully"))
})


export const updatePost = asyncHandler(async (req, res) => {
   
    const { title, content, catagory, tags } = req.body
    // const coverImage = req.file
      
    const postId = req.params.id
    
    if (!postId) {
        throw new ApiError(401, "Id not found")
    }
    const post = await Post.findById(postId)
    
    if (!post) {
        throw new ApiError(401, "Invalid post")
        
    }
    console.log("hello")
    if (post.author.toString() !== req.user._id.toString() ) {
        throw new ApiError(403, "Forbidden")
    }

//     const myImagePath = req.file?.myImagePath
//     const uploadFile = await uploadOnCloudinary(myImagePath)
// if (!uploadFile?.url) {
//         throw new ApiError(400, "Avatar file is required");
//     }
    const updatePost = await Post.findByIdAndUpdate(postId,
        {
            $set: {
                // coverImage: uploadFile.url,
                title,
                content,
                catagory,
                tags
            }
        },
        { new: true }
    )
    return res.status(201)
    .json(new ApiResponse(201,updatePost,"Post successfully updated"))

})