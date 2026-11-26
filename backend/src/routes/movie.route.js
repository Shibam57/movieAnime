const express = require("express");
const verifyAdminJWT =require('../middlewares/admin.middleware.js')
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const {
    createMovie,
    getMoviesBySeries,
    getAllMovies,
    deleteVideo,
    getMovieById,
    togglePublishMovie,
    getTrendingMovies
} = require("../controllers/movie.controller");
const optionalVerifyAdminJWT = require("../middlewares/optionalVerifyAdminJWT.middleware.js")

const router = express.Router();

router.post("/", upload.fields([{ 
    name: "videoFile", 
    maxCount: 1 
},
{ 
    name: "thumbnail", 
    maxCount: 1 
}]), verifyAdminJWT, createMovie);

router.get("/trending", getTrendingMovies);
router.get("/series/:seriesId", getMoviesBySeries);
router.get("/", getAllMovies);
router.get("/:movieId", getMovieById);
router.delete("/:movieId", verifyAdminJWT, deleteVideo);
router.patch("/:movieId/toggle-publish", verifyAdminJWT, togglePublishMovie);


module.exports = router;