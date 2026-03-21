const Notification = require("../models/notification.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Create notification (when new user, payment, movie, etc.)
const createNotification = asyncHandler(async (req, res) => {
  const { message, type } = req.body;

  const notification = await Notification.create({ message, type });

  return res
    .status(201)
    .json(new ApiResponse(201, notification, "Notification created"));
});

// Get all notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

module.exports = { createNotification, getNotifications, markAsRead };