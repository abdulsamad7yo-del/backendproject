import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the Channel Stats: like total views of all videos (i think), total subscribers, total videos, total likes etc.
    // 1. Get userId
    // 2. Views: video have owner filed having user Id and also have views number field
    // 3. Total Videos: Count the doucment 
    // 4. Total likes: using Video model we can get likes, likes model have video field that we can count
    // 5. Subscription model: use this to get user subscriber. 
    const userId = req.user._id;

    try {


        const stats = await Video.aggregate([
            // Only videos of this user
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },

            // Lookup likes for each video
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },

            // Lookup subscribers for this channel (owner)
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "owner",
                    foreignField: "channel",
                    as: "subs"
                }
            },

            // Add counts directly
            {
                $addFields: {
                    likeCount: { $size: "$likes" },
                    subsCount: { $size: "$subs" }
                }
            },

            // Group everything by owner
            {
                $group: {
                    _id: "$owner",
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likeCount" },
                    totalSubscribers: { $max: "$subsCount" } // same for all videos
                }
            },

            // Final clean projection
            {
                $project: {
                    _id: 0,
                    totalVideos: 1,
                    totalViews: 1,
                    totalLikes: 1,
                    totalSubscribers: 1
                }
            }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, stats[0], "Channel Stats Fetched Successfully"));

    } catch (error) {
        throw new ApiError(500, `Error: ${error.message}`);

    }

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id
    try {
        const vidoes = await Video.find({ owner: userId })

        return res
            .status(200)
            .json(new ApiResponse(200, vidoes, "Channel Videos Fetched Successfully"))

    } catch (error) {
        throw new ApiError(500, `Error: ${error.message}`);

    }
})

export {
    getChannelStats,
    getChannelVideos
}