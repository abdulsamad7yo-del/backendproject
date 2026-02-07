import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';

// token fucntions in one

const generateAccessTokenAndRefreshToken = async (userId) => {

    try {
        // generate access token
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found while generating tokens")
        }
        // generate tokens logic here

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        // Store refresh token in db!
        user.refreshToken = refreshToken
        // user.save to save in db new change to user object
        await user.save({ validateBeforeSave: false }) // any validation is skipped like Password{required :true}

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Error while generating tokens")

    }
}



const registerUser = asyncHandler(async (req, res) => {
    // get user details  from frontend
    // validation - not empty, check if user already exists(username and email) 
    // check for images, check for avatar because required
    // upload to cloudinary (gives response we have to store url)
    // create user object-- create entry in db
    // response(remove password and refresh token from response) 
    // check fro user creation success or not 

    // get user details from req.body(forms, json)

    const { email, password, fullName, userName } = req.body;
    console.log("email:", email);

    // if(fullName==""){
    //     throw new ApiError(400,"Fullname is required")
    // }

    // validation
    if (
        [fullName, userName, email, password]
            .some((filed) => filed?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")

    }

    // check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username")
    }

    // access files with help of multer middleware
    // So here multer have uplaoded the files to local server and we acces using req.files
    // now we get the path of file
    // console.log(req?.files);

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path || null

    // avater is required
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    console.log("avatarLocalPath:", avatarLocalPath);
    console.log("coverImageLocalPath:", coverImageLocalPath);

    // upload to cloudinary
    // return full response from cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar")
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImage")

    // check if avatar upload successful
    if (!avatar) {
        throw new ApiError(500, "Error while uploading avatar image")
    }

    // create user object

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        avatar: avatar.url,
        // optional so can be empty
        coverImage: coverImage?.url || "",
        password
    })

    // check for user creation success and remove password and refresh token
    const createdUser = await User.findById(user._id).select(
        // we write what we dont want 
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "User registration failed")
    }

    // response
    // using ApiResponse

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully",))


});

const logInUser = asyncHandler(async (req, res) => {
    // login user logic here
    // req.body-> data
    // username or email  to check user exists
    // password to match
    // generate both tokens 
    // response and cookies

    const { userName, email, password } = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // match password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    // generate tokens
    // made a function to generate both tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    //store inn db
    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken");

    const options = {
        httpOnly: true, //only modified by server,
        secure: true, // only send on https
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
        )

});

const logOutUser = asyncHandler(async (req, res) => {
    // logout user logic here
    //  from cookies
    // remove refresh token from db
    // response

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true

        }
    )

    const options = {
        httpOnly: true, //only modified by server,
        secure: true, // only send on https
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(201, {}, "User Logged Out")
        )



})

const refreshAccessToken = asyncHandler(async (req, res) => {

    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorised Access")

        }
        // can also throw error if refresh token is expired

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")

        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or Used")

        }

        const options = {
            httpOnly: true, //only modified by server,
            secure: true, // only send on https
        }
        // both refresh token and access token generate and send in response and cookies (this is the rightw way)
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed")
            )

    } catch (error) {

        throw new ApiError(401, `Error: ${error.message}`)

    }


})

// try and must be used for better Error Handling
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    // authmiddle used so we get userid

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) // we created earlier in model of user

    if (!isPasswordCorrect) {
        new ApiError(400, "Invalid Password")

    }
    // set new password
    user.password = newPassword // set in object
    await user.save({ validateBeforeSave: false }) // save in db

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Success"))


})


const getCurrentUser = asyncHandler(async (req, res) => {
    // middleware auth.middleware.js return whole user already so just response
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current User")
        )
})

// update except files
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true } // return after update
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))

})

// files only update controller seprate is better approach 

const updateUserAvatar = asyncHandler(async (req, res) => {

    // we use multer middleware which gives 

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }

    )

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Image has been set"))


})

const updateUserCover = asyncHandler(async (req, res) => {


    // we use multer middleware which gives file path

    const coverLocalPath = req.file?.path

    if (!coverLocalPath) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    // we gives file path which cloudinary use to get the image and upload and return whole object, from which we save url in db
    const cover = await uploadOnCloudinary(coverLocalPath)

    if (!cover.url) {
        throw new ApiError(500, "Error while uploading on coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: cover.url }
        },
        { new: true }

    )
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image has been set"))

})


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params

    if (!userName?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    // Aggregation it gives in form of array(if not done opertion to return specfic object form array(yes you can do )).
    // User.aggregate( [ {pipeline1},{pipeline2},{pipeline3} ] )
    // lookup is to get related document (relation)

    const userChannel = await User.aggregate([
        {
            // filter document
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {

            // get all subscribers
            $lookup: {
                from: "subscriptions",   // The target collection to join with
                localField: "_id",       // Field in the current collection (users._id)
                foreignField: "channel", // Field in subscriptions collection to match against
                as: "subscribers"        // Name of the new array field to store matched docs
            }

        },
        {
            // get all subscribed channels
            $lookup: {
                from: "subscriptions", // collection name
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }

        },
        //count
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // true or false if subscribed or not
                isSubscribed: {
                    $cond: {
                        // userid present in subscribers.subscriber
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        // Now to specifc things to retrun
        {
            $project: {
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }

    ])

    // console.log("UserChannel:",userChannel); 

    if (!userChannel?.length) {
        throw new ApiError(404, "Channel does not exist")

    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, userChannel[0], "user channel fecth success")
        )



})

// nested lookup

const getUserWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)

                //  _id:req.user._id // not work because req.user._id return mongodb id as:  ObjectId('sdajn3jenjen2n') , if we have done it above mongoose handle this and gives _id as string but here not
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "watchHistory", // is in videos
                as: "watchHistory",
                // nested pipeline 
                pipeline: [
                    // now we are doing aggregation in "videos" model
                    // get owner(user) details 
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "_id",
                            localField: "owner", // is in vidoes
                            as: "owner",
                            // to project to owner itself ?? try projecting outside owner $lookup
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]

                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                                // Or can use $arrayElemAt:["$owner",0] , You say why only first element : beacuse returns an arry of object and in that arry first object is our result only.
                                // In above function getUserChannelProfile we are returning full array ,
                                // but take a look at the res.json() we only sending [0]
                                // we will still done below but its nested , so one part done inside only.
                                // otherwise it will have returned like result=[ []  ]
                                // but now result = [ [{},{},{}]]
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory, "WatchHistory fetched")
        )
})

export {
    registerUser,
    logInUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCover,
    getUserChannelProfile,
    getUserWatchHistory
};