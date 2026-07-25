import { Router } from "express";
import { userRegister,userLogin,userProfile, updateUserProfile } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router=Router();

router.route('/login').post(userLogin);
router.route('/register').post(userRegister);
router.route("/profile").get(verifyJWT,userProfile)
router.route('/avatar').patch(verifyJWT, upload.single("avatar"),updateUserProfile)

export default router