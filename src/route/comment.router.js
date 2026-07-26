import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {commentOnPost} from "../controller/comment.controller.js"
const router=Router();

router.route('/:id').post(verifyJWT,commentOnPost)


export default router