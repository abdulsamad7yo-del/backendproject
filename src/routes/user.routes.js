import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

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


export default router;