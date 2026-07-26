import { Router } from "express";
import { createPost, getPostProfile, getPostById } from "../controller/post.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js";
const router=Router()

router.route('/posts').post(verifyJWT,upload.single("coverImage"),createPost)
router.route('/postProfile').get(verifyJWT,getPostProfile)
router.route('/post:id').get(verifyJWT,getPostById)

export default router