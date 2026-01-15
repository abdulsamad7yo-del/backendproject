import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

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
    const existingUser = User.findOne({
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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

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

    return res.satus(201).json(
        new ApiResponse(200,createdUser,"User registered successfully",)
    )


});

export { registerUser };