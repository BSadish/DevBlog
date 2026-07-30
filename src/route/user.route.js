import { Router } from "express";
import { userRegister,userLogin,userProfile, updateUserProfile, updateUser, deleteUser, newrefreshToken, logOut } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {authorizeRole} from "../middleware/role.middleware.js"
import { upload } from "../middleware/multer.middleware.js";
// import { limiter } from "../middleware/ratelimit.middleware.js";
const router=Router();

router.route('/login').post(userLogin);
router.route('/register').post(userRegister);
router.route("/profile").get(verifyJWT,userProfile)
router.route('/avatar').patch(verifyJWT, upload.single("avatar"),updateUserProfile)
router.route('/update').put(verifyJWT,updateUser)
router.route('/delete').delete(verifyJWT, authorizeRole("admin"),deleteUser)
router.route('/refreshToken').post(verifyJWT,newrefreshToken)
router.route('/logout').post(verifyJWT,logOut)

export default router