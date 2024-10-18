import { Router } from "express";
import { login, registerUser, getCurrentUser, logout, changePassword, forgotPassword, updateProfile, updatePassword, resetPassword } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";
import  verifyJWT from "../middlewares/auth.js"

const router = Router();

router.route("/auth/register").post(upload.fields([
    {
        name: "profileImage",
        maxCount:1
    }]
    ), registerUser)
router.route("/auth/login").post(login)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/auth/logout").post(verifyJWT, logout);
router.route("/update-profile").put(verifyJWT, upload.fields([{ name: "profileImage", maxCount: 1 }]), updateProfile); 
router.route("/change-password/:id").put(verifyJWT, changePassword); // not working properly with new password
router.route("/forgot-password").post(forgotPassword); 
// Reset Password token validation route (validates the token)
router.route('/reset-password/:token').get(resetPassword);
// Update Password route (after user provides a new password)
router.route('/update-password/:token').post(updatePassword);

export default router;
