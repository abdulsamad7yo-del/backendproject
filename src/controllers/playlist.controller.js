import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    try {
        const playlist = await Playlist.create({
            name,
            description,
            owner: req.user._id
        })

        return res
            .status(201)
            .json(new ApiResponse(201, playlist, "Playlist created successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while creating playlist: ${error.message}`)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    try {
        const playlists = await Playlist.find({ owner: userId })

        return res
            .status(200)
            .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while fetching playlists: ${error.message}`)
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    try {
        const playlist = await Playlist.findById(playlistId).populate("videos")

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while fetching playlist: ${error.message}`)
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    try {
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        // Check if video is already in playlist
        if (playlist.videos.includes(videoId)) {
            throw new ApiError(400, "Video already in playlist")
        }

        playlist.videos.push(videoId)
        await playlist.save()

        return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while adding video: ${error.message}`)
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    try {
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { videos: videoId } },
            { new: true }
        )

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while removing video: ${error.message}`)
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    try {
        const playlist = await Playlist.findByIdAndDelete(playlistId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Playlist deleted successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while deleting playlist: ${error.message}`)
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!name && !description) {
        throw new ApiError(400, "At least one of name or description must be provided")
    }

    try {
        const updateData = {}
        if (name) updateData.name = name
        if (description) updateData.description = description

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $set: updateData },
            { new: true }
        )

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Playlist updated successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while updating playlist: ${error.message}`)
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}