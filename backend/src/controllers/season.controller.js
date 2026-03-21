const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const asyncHandler = require("../utils/asyncHandler")
const Season = require("../models/season.model")
const mongoose = require('mongoose')
const Series = require("../models/series.model")
const { uploadOnCloudinary } = require("../utils/cloudinary")


const createSeason = asyncHandler(async(req, res)=>{
    const { seriesId } = req.params;
    const { seasonNumber, title } = req.body;

    if (!mongoose.isValidObjectId(seriesId)) {
        throw new ApiError(400, "Invalid series ID");
    }

    if (!seasonNumber || !title) {
        throw new ApiError(400, "All fields is required");
    }
    console.log(seasonNumber, title)

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    
    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail is required")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    
    if(!thumbnail){
        throw new ApiError(400, "thumbnail is required")
    }
    console.log(thumbnail)

    const series = await Series.findById(seriesId);
    if (!series) {
        throw new ApiError(404, "Series not found");
    }

    const existing = await Season.findOne({series: seriesId, seasonNumber})

    if(existing){
        throw new ApiError(400, "Season number already exists for this series")
    }

    const season = await Season.create({
        series: seriesId,
        seasonNumber,
        title,
        thumbnail: thumbnail.secure_url,
    })

    if(!season){
        throw new ApiError(400, "Season is not created")
    }

    return res.status(200)
    .json(new ApiResponse(200, season, "Season created successfully"))
})

const getSeasonsBySeries = asyncHandler(async(req, res)=>{
    const {seriesId} = req.params

    if(!mongoose.isValidObjectId(seriesId)){
        throw new ApiError(400, "Invalid series ID")
    }

    const seasons = await Season.find({series: seriesId}).sort({seasonNumber: 1})

    if(!seasons){
        throw new ApiError(400, "seasons can not fetched")
    }

    return res.status(200)
    .json(new ApiResponse(200, seasons, "Seasons fetched successfully"))
})

const getSeasonsById = asyncHandler(async(req, res)=>{
    const {seasonId} = req.params;

    if(!mongoose.isValidObjectId(seasonId)){
        throw new ApiError(400, "Invalid season ID")
    }

    const season = await Season.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(seasonId)
            }
        },
        {
            $lookup: {
                from: "episodes",
                localField: "_id",
                foreignField: "season",
                as: "episodes"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                seasonNumber: 1,
                thumbnail: 1,
                createdAt: 1,
                episodes: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                },
            },
        }
    ])

    if(!season.length) {
        throw new ApiError(404, "Season not found");
    } 

    return res.status(200)
    .json(new ApiResponse(200, season[0], "Season fetched successfully"))
})

const deleteSeason = asyncHandler(async(req, res)=>{
    const {seasonId} = req.params

    if(!mongoose.isValidObjectId(seasonId)){
        throw new ApiError(400, "Invalid season ID")
    }

    const season = await Season.findById(seasonId)

    if(!season){
        throw new ApiError(404, "Season not Found")
    }

    await Episode.deleteMany({season: seasonId})

    await Season.deleteOne();

    return res.status(200)
    .json(new ApiResponse(200, {}, "Season deleted successfully"))
})

module.exports = {
    createSeason,
    getSeasonsById,
    getSeasonsBySeries,
    deleteSeason
}