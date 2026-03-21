const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require("../utils/asyncHandler")
const Series = require('../models/series.model')
const { uploadOnCloudinary } = require('../utils/cloudinary')
const { isValidObjectId, default: mongoose } = require('mongoose')
const Payment = require('../models/payment.model');


const createSeries = asyncHandler(async(req, res)=>{
    const {title, description, genre, isPublished, isPaid, price} = req.body

    if(!title){
        throw new ApiError(400, "title are required") 
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail){
        throw new ApiError(400, "thumbnail is required")
    }

    const newSeries = await Series.create({
        title, 
        description,
        thumbnail: thumbnail.secure_url,
        genre,
        isPublished: isPublished || false,
        isPaid: isPaid === "true",
        price: Number(price) || 0
    })

    if(!newSeries){
        throw new ApiError(400, "series not created")
    }

    return res.status(200)
    .json(new ApiResponse(200, newSeries,"Series created successfully"))
})

const getAllSeries = asyncHandler(async(req, res)=>{
    const {page=1, limit=10, query, sortBy="createdAt", sortType="desc"} = req.query

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber-1) * limitNumber

    const matchStage = {
        isPublished: true,
        ...(query && {
            title: { $regex: query, $options: "i" }
        })
    }

    const sortStage = {
        [sortBy]: sortType==='asc'? 1:-1
    }

    const seriesList = await Series.aggregate([
        {$match: matchStage},
        {
            $lookup: {
                from:"seasons",
                localField: "_id",
                foreignField: "series",
                as: "seasons"
            }
        },
        {
            $addFields: {
                seasonsCount: {
                    $size: "$seasons"
                }
            }
        },
        {
            $lookup: {
                from: "episodes",
                localField: "seasons._id",
                foreignField: "season",
                as: "episodes"
            }
        },
        {
            $addFields: {
                episodesCount: {$size: "$episodes"}
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                genre: 1,
                isPublished: 1,
                isPaid: 1,
                price: 1,
                seasonsCount: 1,
                episodesCount: 1,
                createdAt: 1
            }
        },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNumber }
    ])

    console.log("MATCH STAGE:", matchStage);
    console.log("Series found:", seriesList.length);

    if (!seriesList.length) {
        throw new ApiError(404, "No series found");
    }

    return res.status(200)
    .json(new ApiResponse(200, seriesList, "Series fetched successfully"));
})

const getSeriesById = asyncHandler(async(req, res)=>{
    const {seriesId} = req.params;

    if(!isValidObjectId(seriesId)){
        throw new ApiError(400, "Invalid series ID")
    }

    const series = await Series.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(seriesId)
            }
        },
        {
            $lookup: {
                from: "seasons",
                localField: "_id",
                foreignField: "series",
                as: "seasons",
                pipeline: [
                    {
                        $lookup: {
                            from: "episodes",
                            localField: "_id",
                            foreignField: "season",
                            as: "episodes"
                        }
                    },
                    {
                        $addFields: {
                            episodesCount: {
                                $size: "$episodes"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                seasonsCount: {
                    $size: "$seasons"
                }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                genre: 1,
                isPublished: 1,
                isPaid: 1,
                price: 1,
                createdAt: 1,
                seasonsCount: 1, 
                "seasons._id": 1,
                "seasons.seasonNumber": 1,
                "seasons.title": 1,
                "seasons.episodesCount": 1,
                "seasons.episodes._id": 1,
                "seasons.episodes.title": 1,
                "seasons.episodes.description": 1,
                "seasons.episodes.duration": 1,
            }
        }
    ])

    if(!series || series.length === 0){
        throw new ApiError(404, "Series not found")
    }
    const finalSeries = series[0];

    if(finalSeries.isPaid){
        const hasPaid = await Payment.findOne({
            user: req.user._id,
            contentId: finalSeries._id,
            contentModel: "Series",
            paymentStatus: "success"
        })

        if(!hasPaid){
            finalSeries.seasons.forEach(season => {
                season.episodes = [];
            });
        }
    }

    return res.status(200)
    .json(new ApiResponse(200, finalSeries, "Series fetched successfully"))
})

const updateSeries = asyncHandler(async(req, res)=>{
    const {seriesId} = req.params

    let updates = {...req.body}

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if(!thumbnail){
            throw new ApiError(400, "Thumbnail upload failed")
        }

        updates.thumbnail = thumbnail.secure_url;
    }

    const series = await Series.findByIdAndUpdate(seriesId, updates, {
        new: true,
        runValidators: true
    })

    if(!series){
        throw new ApiError(404, "Series not found")
    }

    return res.status(200).json(new ApiResponse(200, series, "Series updated successfully"))
})

const deleteSeries = asyncHandler(async(req, res)=>{
    const {seriesId}= req.params

    if(!isValidObjectId(seriesId)){
        throw new ApiError(400, "series not found")
    }

    const series = await Series.findByIdAndDelete(seriesId)

    if(!series){
        throw new ApiError(404, "Series not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, {}, "Series deleted successfully"))
})

const togglePublishSeries = asyncHandler(async (req, res) => {
    const { seriesId } = req.params;

    if (!isValidObjectId(seriesId)) {
        throw new ApiError(400, "Invalid series ID");
    }

    const series = await Series.findById(seriesId);
    if (!series) throw new ApiError(404, "Series not found");

    series.isPublished = !series.isPublished;
    await series.save();

    return res.status(200)
    .json(new ApiResponse(200, series, `Series ${series.isPublished ? "published" : "unpublished"} successfully`));
});

const getTrendingSeries = asyncHandler(async (req, res) => {
  try {
    const series = await Series.find()
      .sort({ views: -1 }) 
      .limit(4);           

    return res
      .status(200)
      .json(new ApiResponse(200, series, "Trending series fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch trending series");
  }
});

const getSeriesByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.params;

  const series = await Series.find({
    genre: { $regex: new RegExp(`^${genre}$`, "i") }, // case-insensitive
    isPublished: true,
  });

  if (!series || series.length === 0) {
    throw new ApiError(404, "No series found for this genre");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, series, "Series fetched successfully"));
});

module.exports = {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
    togglePublishSeries,
    getTrendingSeries,
    getSeriesByGenre
}