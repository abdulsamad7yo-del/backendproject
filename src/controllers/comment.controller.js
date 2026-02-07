import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    try {

        const comments = await Comment.aggregate([
            { $match: { video: new mongoose.Types.ObjectId(videoId) } },
            { $sort: { createdAt: -1 } },
            {
                // getting details of comment owner
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {
                $project: {
                    content: 1,
                    video: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        email: 1
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ])
        if (!comments) {
            throw new ApiError(404, "Comments not found for this video")
        }
        const result = await Comment.aggregatePaginate(comments, {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                docs: "comments",
                totalDocs: "totalResults",
                totalPages: "totalPages"
            }
        })
        return res
            .status(200)
            .json(
                new ApiResponse(200, result, "Comments fetched successfully")
            )

    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "An error occurred while fetching comments"))

    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // videoId
    const { videoId } = req.params
    const { content } = req.body

    try {
        if (!content) {
            throw new ApiError(400, "Content is required")
        }
        const comment = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id
        })
        return res
            .status(201)
            .json(
                new ApiResponse(201, comment, "Comment added successfully")
            )
    } catch (error) {
        throw new ApiError(500, "An error occurred while adding comment")

    }
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // commentId
    const { commentId } = req.params
    const { content } = req.body
    try {
         if (!content) {
            throw new ApiError(400, "Content is required")
        }
        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, owner: req.user._id },
            { content },
            { new: true }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(200, comment, "Comment updated successfully")
            )
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating comment")
        
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    //commentId
    const { commentId } = req.params
    try {
        if (!commentId) {
            throw new ApiError(400, "commentId is required")
        }
        const comment = await Comment.findOneAndDelete(
            { _id: commentId, owner: req.user._id }
        )
        if (!comment) {
            throw new ApiError(404, "Comment not found or you are not the owner")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, null, "Comment deleted successfully")
            )
    } catch (error) {
        throw new ApiError(500, "An error occurred while deleting comment")
        
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}