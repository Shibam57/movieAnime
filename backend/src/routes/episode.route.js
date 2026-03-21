const express = require("express");
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/auth.middleware");
const verifyAdminJWT = require("../middlewares/admin.middleware");
const { createEpisode, getEpisodesBySeason, getEpisode, updateEpisode, deleteEpisode, playEpisode } = require("../controllers/episode.controller");
const multer = require('multer');



const router = express.Router();

router.post("/create-episode/:seasonId", verifyAdminJWT, upload.fields([{
    name: "videoUrl",
    maxCount: 1
},
{
    name: "thumbnail",
    maxCount: 1
}]), createEpisode);

router.get("/season/:seasonId", getEpisodesBySeason);
router.get("/user-episode/:episodeId", verifyJWT, getEpisode);

router.put("/:episodeId", verifyAdminJWT, updateEpisode);
router.delete("/delete-episode/:episodeId", verifyAdminJWT, deleteEpisode);
router.get("/play-episode/:episodeId", verifyJWT, playEpisode);

module.exports = router