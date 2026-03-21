const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const Movie = require("../models/movie.model");
const Series = require("../models/series.model");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");
const Episode = require("../models/episode.model");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [movieCount, seriesCount, episodeCount, userCount, totalRevenueResult] = await Promise.all([
    Movie.countDocuments(),
    Series.countDocuments(),
    Episode.countDocuments(),
    User.countDocuments(),
    Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // Monthly revenue (last 6 months)
  const revenueGraph = await Payment.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id": 1 } },
    { $limit: 6 },
    { $project: { _id: 0, month: "$_id", revenue: 1 } },
  ]);

  // Monthly user growth (last 6 months)
  const userGraph = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        users: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
    { $limit: 6 },
    { $project: { _id: 0, month: "$_id", users: 1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          movies: movieCount,
          series: seriesCount,
          totalUsers: userCount,
          totalRevenue,
          totalVideos: movieCount + seriesCount + episodeCount,
          revenueGraph,
          userGraph,
        },
        "Dashboard stats fetched successfully"
      )
    );
});

module.exports = getDashboardStats