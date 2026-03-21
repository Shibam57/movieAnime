const Episode = require("../models/episode.model");
const Season = require("../models/season.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");
const hasAccess = require("../utils/hasAccess");


const createEpisode = asyncHandler(async(req, res)=>{
    const {seasonId} = req.params
    const {title, description, episodeNumber, isPaid, price, releaseDate} = req.body

    if(!mongoose.isValidObjectId(seasonId)){
        throw new ApiError(400, "Invalid season ID")
    }

    const season = await Season.findById(seasonId);

    if(!season){
        throw new ApiError(404, "Season not found")
    }

    if ([title, episodeNumber, description].some((field) => !field || field?.toString().trim() === "")) {
        throw new ApiError(400, "Title and episode number are required");
    }
    console.log(title, episodeNumber, description)

    const videoLocalPath = req.files?.videoUrl?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!(videoLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!(video && thumbnail)) {
        throw new ApiError(400, "Failed to upload video/thumbnail");
    }
    console.log(video)
    console.log(thumbnail)

    const newEpisode = await Episode.create({
        season: seasonId,
        title,
        description,
        episodeNumber,
        videoUrl: video.secure_url,
        thumbnail: thumbnail.secure_url,
        releaseDate: releaseDate || Date.now(),
        isPaid: isPaid === "true",
        price: Number(price) || 0,
    });

    if(!newEpisode){
        throw new ApiError(400, "Episode not created");
    }

    return res.status(200)
    .json(new ApiResponse(200, newEpisode, "Episode uploaded successfully"))
})

const getEpisode = asyncHandler(async(req, res) => {
    const { episodeId } = req.params;

    if (!mongoose.isValidObjectId(episodeId)) {
        throw new ApiError(404, "Invalid episode ID");
    }

    const episode = await Episode.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(episodeId) } },
        {
            $lookup: {
                from: "seasons",
                localField: "season",
                foreignField: "_id",
                as: "season"
            }
        },
        { $unwind: "$season" },
        {
            $project: {
                _id: 1, 
                title: 1, 
                description: 1, 
                episodeNumber: 1,
                videoUrl: 1, 
                thumbnail: 1, 
                releaseDate: 1,
                isPaid: 1, 
                price: 1,
                createdAt: 1,
                updatedAt: 1,
                "season._id": 1,
                "season.title": 1,
                "season.description": 1,
                "season.seasonNumber": 1,
                "season.series": 1
            }
        }
    ]);

    if (!episode || episode.length === 0) {
        throw new ApiError(404, "Episode not found");
    }

    const ep = episode[0];

    if (ep.isPaid) {
        const access = await hasAccess(userId, episodeId);
        if (!access) {
            throw new ApiError(403, "This is paid content. Please purchase first.");
        }
    }

    return res.status(200).json(new ApiResponse(200, ep, "Episode fetched successfully"));
});

// const getEpisode = asyncHandler(async(req, res)=>{
//     const {episodeId}=req.params

//     if(!mongoose.isValidObjectId(episodeId)){
//         throw new ApiError(404, "Invalid episode ID")
//     }

//     const episode = await Episode.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(episodeId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "seasons",
//                 localField: "season",
//                 foreignField: "_id",
//                 as: "season"
//             }
//         },
//         {
//             $unwind: {
//                 path: "$season",
//                 preserveNullAndEmptyArrays: true
//             }
//         },
//         {
//             $project: {
//                 _id: 1,
//                 title: 1,
//                 description: 1,
//                 episodeNumber: 1,
//                 videoUrl: 1,
//                 thumbnail: 1,
//                 releaseDate: 1,
//                 isPaid: 1,
//                 price: 1,
//                 createdAt: 1,
//                 updatedAt: 1,
//                 "season._id": 1,
//                 "season.title": 1,
//                 "season.description": 1,
//                 "season.seasonNumber": 1,
//                 "season.series": 1
//             }
//         }
//     ])

//     if(!episode || episode.length === 0){
//         throw new ApiError(404, "Episode not found")
//     }

//     if(episode.isPaid){
//         const hasPurchased = await PaymentAddress.findOne({
//             user: userId,
//             contentId: episode._id,
//             contentModel: "Episode",
//             paymentStatus: "success"
//         })

//         if(!hasPurchased){
//             throw new ApiError(403, "This is paid content. Please purchase first.")
//         }
//     }

//     return res.status(200)
//     .json(new ApiResponse(200, episode[0], "Episode fetched successfully"))
// })

const getEpisodesBySeason = asyncHandler(async(req, res)=>{
    const {seasonId} = req.params;

    if(!mongoose.isValidObjectId(seasonId)){
        throw new ApiError(400, "Invalid season ID")
    }

    const episodes = await Episode.aggregate([
        {
            $match:{
                season: new mongoose.Types.ObjectId(seasonId)
            }
        },
        {
            $sort: {
                episodeNumber: 1
            }
        },
        {
            $lookup: {
                from: "seasons",
                localField: "season",
                foreignField: "_id",
                as: "season"
            }
        },
        {
            $unwind:{
                path: "$season",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                episodeNumber: 1,
                videoUrl: 1,
                thumbnail: 1,
                releaseDate: 1,
                isPaid: 1,
                price: 1,
                createdAt: 1,
                updatedAt: 1,
                "season._id": 1,
                "season.title": 1,
                "season.seasonNumber": 1,
                "season.series": 1
            }
        }
    ])

    if(!episodes || episodes.length === 0){
        throw new ApiError(404, "No episodes found for this season")
    }

    return res.status(200)
    .json(new ApiResponse(200, episodes, "Episodes fetched successfully"))
})

const updateEpisode = asyncHandler(async(req, res)=>{
    const {episodeId} = req.params;

    if(!mongoose.isValidObjectId(episodeId)){
        throw new ApiError(400, "Invalid episode ID")
    }

    const updateEpisode = await Episode.findByIdAndUpdate(episodeId, req.body, {
        new: true,
        runValidators: true
    })

    if(!updateEpisode){
        throw new ApiError(404, "Episode not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, updateEpisode, "Episode updated successfully"))
})

const deleteEpisode = asyncHandler(async(req, res)=>{
    const {episodeId} = req.params

    if(!mongoose.isValidObjectId(episodeId)){
        throw new ApiError(400, "Invalid episode ID")
    }

    const deletedepisode = await Episode.findByIdAndDelete(episodeId)

    if(!deletedepisode){
        throw new ApiError(404, "Episode not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, null, "Episode deleted successfully"))
})

const playEpisode = asyncHandler(async(req, res) => {
    const { episodeId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(episodeId)) {
        throw new ApiError(400, "Invalid episode ID");
    }

    const access = await hasAccess(userId, episodeId);
    if (!access) {
        throw new ApiError(403, "You must purchase this content first");
    }

    const episode = await Episode.findById(episodeId);
    if (!episode) {
        throw new ApiError(404, "Episode not found");
    }

    return res.status(200).json(new ApiResponse(200, { videoUrl: episode.videoUrl }, "Access granted"));
});

module.exports = {
    createEpisode,
    getEpisode,
    getEpisodesBySeason,
    deleteEpisode,
    updateEpisode,
    playEpisode
}