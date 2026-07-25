import { Router } from "express";
import { userRegister,userLogin } from "../controller/user.controller.js";
const router=Router();

router.route('/login').post(userLogin);
router.route('/register').post(userRegister);

export default router