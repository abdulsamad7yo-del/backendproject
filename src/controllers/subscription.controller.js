import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    // 1. validate channelId (its userId)
    // 2. check if channel exists
    // 3. check if subscription already exists
    // 4. if exists, unsubscribe (delete subscription)
    // 5. if not exists, subscribe (create subscription)

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const subscriberId = req.user._id

    const existingSubscription = await Subscription.findOne({
        channelId,
        subscriberId
    })
    if (existingSubscription) {
        //unsubscribe
        await Subscription.deleteOne({
            _id: existingSubscription._id
        })
        return res.status(200).json(
            new ApiResponse(200, null, "Unsubscribed Successfully")
        )
    }
    //subscribe
    const newSubscription = await Subscription.create({
        channelId,
        subscriberId
    })
    return res.status(200).json(
        new ApiResponse(200, newSubscription, "Subscribed Successfully")
    )

})

// controller to return subscriber list of a channel( User )
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // 1. validate channelId
    // 2. check if channel exists
    // 3. find subscriptions where channelId matches
    // 4. populate subscriber details

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    try {
        // Check if channel exists
        const channelExists = await User.findById(channelId);
        if (!channelExists) {
            throw new ApiError(404, "Channel not found");
        }

        // Find subscriptions 
        const subscriptions = await Subscription.find(
            {
                channel: channelId

            }
        ).populate("subscriber", "userName avatar");

        return res
            .status(200)
            .json(
                new ApiResponse(200, subscriptions, "Channel Subscribers Fetched Successfully")
            );

    } catch (error) {
        throw new ApiError(500, `Unable to fetch channel subscribers: ${error.message}`);
    }



})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // 1. validate subscriberId
    // 2. check if subscriber exists
    // 3. find subscriptions where subscriberId matches
    // 4. populate channel details

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }
    try {

        // Check if subscriber exists
        const subscriberExists = await User.findById(subscriberId)
        if (!subscriberExists) {
            throw new ApiError(404, "Subscriber not found")
        }

        // Find subscriptions and populate channel details
        const subscriptions = await Subscription.find(
            {
                subscriber: subscriberId  //it will get those [{subscriber,channel},{},{}] documents where subscriberId(userId) matches
            }
        ).populate("channel", "userName avatar") // and here we get channel and we get User details by nesting 

        return res
            .status(200)
            .json(
                new ApiResponse(200, subscriptions, "Subscribed Channels Fetched Successfully")
            )


    } catch (error) {
        throw new ApiError(500, `Unable to fetch subscribed channels: ${error.message}`)
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}