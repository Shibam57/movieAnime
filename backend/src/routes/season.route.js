const express = require("express");
const {
  createSeason,
  getSeasonsById,
  getSeasonsBySeries,
  deleteSeason,
} = require("../controllers/season.controller");
const verifyAdminJWT = require("../middlewares/admin.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/series/:seriesId/seasons", verifyAdminJWT, upload.fields([{ name: "thumbnail", maxCount: 1 }]), createSeason);
router.get("/series/:seriesId", getSeasonsBySeries);

router.get("/seasons/:seasonId", getSeasonsById);

router.delete("/seasons/:seasonId", verifyAdminJWT, deleteSeason);

module.exports = router;