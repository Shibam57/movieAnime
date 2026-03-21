const Movie = require("../models/movie.model");
const Series = require("../models/series.model");
const Episode = require("../models/episode.model");
const asyncHandler = require("../utils/asyncHandler");

const searchContent = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") return res.status(400).json({ message: "Query is required" });

  const regex = new RegExp(q, "i");

  const [movies, series, episodes] = await Promise.all([
    Movie.find({ title: regex }).select("title thumbnail _id").limit(10),
    Series.find({ title: regex }).select("title thumbnail _id").limit(10),
    Episode.find({ title: regex }).select("title thumbnail _id").limit(10),
  ]);

  res.status(200).json({
    success: true,
    data: { movies, series, episodes }
  });
});

module.exports = searchContent