const Episode = require("../models/episode.model");
const Purchase = require("../models/purchase.model");
const Season = require("../models/season.model");


const hasAccess = async (userId, episodeId) => {
  // 1. Check if user bought this episode
  const episodePurchase = await Purchase.findOne({
    user: userId,
    contentType: "episode",
    contentId: episodeId,
    paymentStatus: "success"
  });
  if (episodePurchase) return true;

  // 2. Check if user bought the season this episode belongs to
  const episode = await Episode.findById(episodeId).populate("season");
  const seasonPurchase = await Purchase.findOne({
    user: userId,
    contentType: "season",
    contentId: episode.season._id,
    paymentStatus: "success"
  });
  if (seasonPurchase) return true;

  // 3. Check if user bought the series this season belongs to
  const season = await Season.findById(episode.season._id).populate("series");
  const seriesPurchase = await Purchase.findOne({
    user: userId,
    contentType: "series",
    contentId: season.series._id,
    paymentStatus: "success"
  });
  if (seriesPurchase) return true;

  return false; // no purchase found
}

module.exports = hasAccess;
