const express = require("express");
const searchContent = require("../controllers/content.controller");
const router = express.Router();

router.get("/search", searchContent);

module.exports = router;