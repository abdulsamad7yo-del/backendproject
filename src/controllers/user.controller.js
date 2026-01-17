import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

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

        // store refresh token in db
        user.refreshToken = refreshToken
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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null

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

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully",)
    )


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

export { registerUser, logInUser, logOutUser };