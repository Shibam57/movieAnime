const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

module.exports = router;