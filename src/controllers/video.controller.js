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
                videoFile: videoUpload.url,
                thumbnail: thumbnailUpload.url,
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
    // Video.findByIdAndUpdate(videoId,{title,description,videoFile})

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}