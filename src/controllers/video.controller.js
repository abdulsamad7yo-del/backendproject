import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    let filter = {};
    if (query) {
        filter.title = { $regex: query }; // case-insensitive search
    }
    if (userId) {
        filter.userId = userId;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch videos
    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

    // Count for pagination metadata
    const total = await Video.countDocuments(filter);

    res
        .status(200)
        .json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            data: new ApiResponse(200, videos, "Videos fetched successfully"),
        });


})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body
        // TODO: get video, upload to cloudinary, create video
        if (!title || !description) {
            throw new ApiError(400, "Title and Description Are required")
        }

        const videoFilePath = req.files?.videoFile[0]?.path

        const thumbnailPath = req.files?.thumbnail[0]?.path

        if (!videoFilePath || !thumbnailPath) {
            throw new ApiError(400, "No files Path Provided")
        }

        const videoUpload = await uploadOnCloudinary(videoFilePath)
        const thumbnailUpload = await uploadOnCloudinary(thumbnailPath)

        if (!videoUpload || !thumbnailUpload) {
            throw new ApiError(500, "Error while uploading")
        }

        const videoDuration = videoUpload?.duration
        const userId = req.user._id

        const publish = await Video.create(
            {
                videoFile: videoUpload.url || videoUpload.secure_url,
                thumbnail: thumbnailUpload.url || thumbnailUpload.secure_url,
                title,
                description,
                duration: videoDuration,
                owner: userId

            }
        )

        if (!publish) {
            throw new ApiError(500, "Unable to Publish Video")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, publish, "Video Published SuccessFully")
            )


    } catch (error) {

        throw new ApiError(401, `Error: ${error.message}`)

    }




})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!videoId) {
        throw new ApiError(400, "videoId Not Provided")
    }
    try {

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiError(404, "Video not found");
        }


        return res.status(200).json(
            new ApiResponse(201, video, "Video retrieved successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Unable to retrieve video")
    }

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail(seprate route is recommended )
    // 1. take all {title,description}
    // 2. thumbnail url is taken using req.file.path 
    // 3. upload to cloudinary and get url 
    // 4. FindByIdAndUpdate
    // Video.findByIdAndUpdate(videoId,{title,description,thumbnail})

    const { title, description } = req.body;
    const thumbnailPath = req.file?.path;

    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json(
            new ApiResponse(404, null, "Video not found")
        );
    }

    if (thumbnailPath && thumbnailPath.length > 0) {
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        video.thumbnail = thumbnail.url || thumbnail.secure_url;
    }

    if (title && title.length > 0) {
        video.title = title;
    }

    if (description && description.length > 0) {
        video.description = description;
    }

    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Updated Video Information")
        );



})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!videoId) {
        throw new ApiError(400, "No Video Id Given")
    }
    try {

        const deletedVideo = await Video.findByIdAndDelete(videoId)

        if (!deletedVideo) {
            throw new ApiError(404, "Video not found");
        }

        return res
            .status(200)
            .json(
                200,
                deletedVideo,
                "Video Deleted"
            )
    } catch (error) {
        throw new ApiError(500, `Error:${error.message}`)
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "No Video Id Given")
    }

    try {
        const video = await Video.findById(videoId, { isPublished: 1 })
        if (!video) {
            throw new ApiError(404, "No Video found")
        }

        const toggled = await Video.findByIdAndUpdate(videoId, { $set: { isPublished: !video.isPublished } }, { new: true })

        return res.status(200).json(
            new ApiResponse(200, toggled, "Toogle Success")
        )

    } catch (error) {
        throw new ApiError(500, `Error: ${error.message}`);


    }

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}