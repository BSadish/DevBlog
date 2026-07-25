import mongoose from "mongoose";

const postSchema = new mongoose.connect((

    {
        title: {
            type: String,
            requird: true
        },
        content: {
            type: String,
            required: true
        },
        coverImage: {
            type: string
        },
        category: {
            type: String
        },
        tags:
            [string],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        views: {
            type: Number,
            default: 0
        }
    }
), { timestamps: true })

export const Post = mongoose.model('Post', postSchema)