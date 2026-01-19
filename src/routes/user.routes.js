import { Router } from 'express';
import { logInUser, logOutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// upload middleware to handle multipart/form-data

router.route("/register").post(
    upload.fields([
        {
            name:"avatar", // same field name frontend and backend
            maxCount:1 // files to accept
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(logInUser)

// secured routes

router.route("/logout").post(verifyJWT, logOutUser)

router.route("/refreshToken").post(refreshAccessToken)

// Routes: change password route, updateDetails route, change avatar route, coverImage route



export default router;