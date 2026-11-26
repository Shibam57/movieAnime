const express = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const verifyAdminJWT = require("../middlewares/admin.middleware");
const upload = require("../middlewares/multer.middleware");
const {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
    togglePublishSeries,
    getTrendingSeries,
    getSeriesByGenre
} = require("../controllers/series.controller");


const router = express.Router();

router.post("/", verifyAdminJWT, upload.fields([{ 
    name: "thumbnail", 
    maxCount: 1 
}]), createSeries);

router.get("/all-series", getAllSeries);
router.get("/seriesId/:seriesId", getSeriesById);

router.put(
    "/update-series/:seriesId",
    verifyAdminJWT,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    updateSeries
);
router.patch("/:seriesId/toggle-publish", verifyAdminJWT, togglePublishSeries);

router.delete("/remove-series/:seriesId", verifyAdminJWT, deleteSeries);

router.get("/trending", getTrendingSeries);
router.get("/genre/:genre", getSeriesByGenre);

module.exports = router;