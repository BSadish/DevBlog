import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {toggleLike} from "../controller/like.controller.js"

const router=Router()

router.route('/:postId/like').post(verifyJWT,toggleLike)

export default router