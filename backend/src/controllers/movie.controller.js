const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
const Movie = require('../models/movie.model')
const Payment = require('../models/payment.model');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary')
const { isValidObjectId, default: mongoose } = require('mongoose')


const createMovie = asyncHandler(async(req, res)=>{
    const {title, description, duration, isPaid, price, series, isPublished} = req.body;

    if([title, description].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    console.log(title,"\n",description, duration, series)

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "All fields are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!(video && thumbnail)){
        throw new ApiError(400, "All fields are required")
    }

    console.log(video)
    console.log(thumbnail)

    const newMovie = await Movie.create({
        title, 
        description,
        duration: video.duration,
        videoFile: video.secure_url,
        thumbnail: thumbnail.secure_url,
        series,
        isPublished: isPublished === "true"? true:false,
        isPaid: isPaid === "true",
        price: Number(price) || 0
    })

    if(!newMovie){
        throw new ApiError("400", "movie not uploaded")
    }

    return res.status(200)
    .json(new ApiResponse(200, newMovie, "movie is uploaded successfully"))
})

const getMoviesBySeries = asyncHandler(async(req, res)=>{
    const {seriesId} = req.params;

    if(!isValidObjectId(seriesId)){
        throw new ApiError(400, "Invalid movie series")
    }

    const movie = await Movie.aggregate([
        {
            $match: {
                series: new mongoose.Types.ObjectId(seriesId)
            }
        },
        {
            $lookup: {
                from: "series",
                localField: "series",
                foreignField: "_id",
                as: "series"
            }
        },
        {
            $unwind: "$series"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        { 
            $limit: 1 
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                isPublished: 1,
                isPaid: 1,
                price: 1,
                createdAt: 1,
                "series._id": 1,
                "series.title": 1,
                "series.thumbnail": 1
            }
        }
    ])

    if (!movie.length) {
        throw new ApiError(404, "No available movies");
    }

    return res.status(200)
    .json(new ApiResponse(200, movie, "movie featch successfully"))
})

const getAllMovies = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", seriesId } = req.query;

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.max(parseInt(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Match stage
    const matchStage = {
        ...(seriesId && isValidObjectId(seriesId) && {
            series: new mongoose.Types.ObjectId(seriesId)
        }),
        ...(query && {
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        })
    };

    // Public users see only published movies
    if (!req.admin) {
        matchStage.isPublished = true;
    }

    const sortStage = { [sortBy]: sortType === "asc" ? 1 : -1 };

    // Aggregation
    const movies = await Movie.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "series",
                localField: "series",
                foreignField: "_id",
                as: "series"
            }
        },
        {
            $addFields: {
                series: { $arrayElemAt: ["$series", 0] } 
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                isPublished: 1,
                isPaid: 1,
                price: 1,
                createdAt: 1,
                "series._id": 1,
                "series.title": 1,
                "series.thumbnail": 1
            }
        },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNumber }
    ]);

    const totalMovies = await Movie.countDocuments(matchStage);

    if (!movies.length) {
        throw new ApiError(404, "Movies not found");
    }

    console.log(totalMovies)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                movies,
                totalMovies,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalMovies / limitNumber)
            },
            "Movies fetched successfully"
        )
    );
});

const deleteVideo = asyncHandler(async(req, res)=>{
    const {movieId} = req.params

    if(!isValidObjectId(movieId)){
        throw new ApiError(400, "Invalid video ID")
    }

    const movie = await Movie.findById(movieId)

    if(!movie){
        throw new ApiError(404, "Movie not found")
    }

    await deleteFromCloudinary(movie.videoFile)
    await deleteFromCloudinary(movie.thumbnail)

    await movie.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200, {}, "Movie deleted successfully"))
})

const getMovieById = asyncHandler(async(req, res)=>{
    const {movieId} = req.params

    if(!isValidObjectId(movieId)){
        throw new ApiError(400, "Invaild movie ID")
    }

    const movie = await Movie.findById(movieId)

    if(!movie){
        throw new ApiError(404, "Movie not found");
    }

    if(!movie.isPublished){
        if(!req.user?.isAdmin){
            throw new ApiError(403, "This movie is not published");
        }
    }

    if(movie.isPaid){
        const hasPaid = await Payment.findOne({
            user: req.user._id,
            contentId: movieId,
            contentModel: "Movie",
            paymentStatus: "success"
        })

        if(!hasPaid){
            throw new ApiError(403, "This is paid content. Please purchase first.")
        }
    }

    return res.status(200)
    .json(new ApiResponse(200, movie, "Movie fetched successfully"))
})

const togglePublishMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) throw new ApiError(404, "Movie not found");

    movie.isPublished = true; // or toggle with !movie.isPublished
    await movie.save();

    return res.status(200).json(new ApiResponse(200, movie, "Movie published successfully"));
});

const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isPublished: true })
      .sort({ views: -1, createdAt: -1 }) // change logic if needed
      .limit(4);

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
    createMovie,
    getMoviesBySeries,
    getAllMovies,
    deleteVideo,
    getMovieById,
    togglePublishMovie,
    getTrendingMovies
}