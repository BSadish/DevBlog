import { Router } from "express";
import { createPost, getPostProfile, getPostById, getAllPosts, updatePost } from "../controller/post.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js";
const router=Router()

router.route('/posts').post(verifyJWT,upload.single("coverImage"),createPost)
router.route('/postProfile').get(verifyJWT,getPostProfile)
router.route('/post/:id').get(verifyJWT,getPostById)
router.route('/allPost').get(verifyJWT,getAllPosts)
router.route('/update/:id').patch(verifyJWT,upload.single("coverImage"),updatePost)

export default router