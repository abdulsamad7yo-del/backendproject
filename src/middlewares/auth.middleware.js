import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // verify JWT from cookies
        // accessToken in cookies (access due to cookie parser middleware)  and get get token from header as well if not in cookies
        const token = req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");

        }

        // accessToken have many things in it we signed like _id,email,username,fullName 
        // so we can just decode( jwt.verify() gives decoded data) it and get user _id 

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken")

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next() // tells now my work is done go to next function given
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid Access Token")

    }


});