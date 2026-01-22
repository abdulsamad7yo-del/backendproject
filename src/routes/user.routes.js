import { Router } from 'express';
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, logInUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCover } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// upload middleware to handle multipart/form-data

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", // same field name frontend and backend, ** this name is used to acces req.files.avatar[0]
            maxCount: 1 // files to accept
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(logInUser)

// secured routes

router.route("/logout").post(verifyJWT, logOutUser)

router.route("/refreshToken").post(refreshAccessToken)

// Routes: change password route, updateDetails route, change avatar route, coverImage route

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCover)

// at time of params
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getUserWatchHistory)

export default router;