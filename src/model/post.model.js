import mongoose from "mongoose";

const postSchema = new mongoose.Schema((

    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        coverImage: {
            type: String
        },
        catagory: {
            type: String
        },
        tags:
            [String],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true
        },
        views: {
            type: Number,
            default: 0
        }
    }
), { timestamps: true })

export const Post = mongoose.model('Post', postSchema)