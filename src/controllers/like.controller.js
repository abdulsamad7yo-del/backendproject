import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    try {
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video ID")
        }
        const userId = req.user._id

        const existingLike = await Like.findOne({ video: videoId, likedBy: userId })

        if (existingLike) {
            // If like exists, remove it (unlike)
            await Like.deleteOne({ _id: existingLike._id })
            return res.status(200).json(new ApiResponse(200, "Video unliked successfully"))
        }
        // If like does not exist, create it (like)
        const newLike = new Like({ video: videoId, likedBy: userId })
        await newLike.save()
        return res
            .status(200)
            .json(new ApiResponse(200, "Video liked successfully"))

    } catch (error) {
        throw new ApiError(500, "Server Error")
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    try {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid comment ID")
        }
        const userId = req.user._id

        const existingLike = await Like.findOne({ comment: commentId, likedBy: userId })

        if (existingLike) {
            // If like exists, remove it (unlike)
            await Like.deleteOne({ _id: existingLike._id })
            return res.status(200).json(new ApiResponse(200, "Comment unliked successfully"))
        }
        // If like does not exist, create it (like)
        const newLike = new Like({ comment: commentId, likedBy: userId })
        await newLike.save()
        return res
            .status(200)
            .json(new ApiResponse(200, "Comment liked successfully"))

    } catch (error) {
        throw new ApiError(500, "Server Error")

    }

})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos of user

    try {
        // const videos = await Like.find({ likedBy: req.user._id}).select('video -_id').populate('video')
        const likedVideos = await Like.find({ likedBy: req.user._id, video: { $ne: null } }).populate('video');
        const videos = likedVideos.map(like => like.video);

        return res.status(200).json(new ApiResponse(200, "Liked videos fetched successfully", videos))

    } catch (error) {
        throw new ApiError(500, "Server Error")

    }
})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}