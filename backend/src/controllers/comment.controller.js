const { isValidObjectId } = require('mongoose');
const Comment = require('../models/comment.model')
const ApiError = require('../utils/ApiError')
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const addComment = asyncHandler(async(req, res)=>{
    const {contentId, contentModel, content} = req.body

    if(!contentId || !contentModel || !content?.trim()){
        throw new ApiError(400, "contentId, contentModel, and text are required")
    }

    const allowedModels = ["Movie", "Series", "Season", "Episode"]
    if (!allowedModels.includes(contentModel)) {
        throw new ApiError(400, "Invalid contentModel");
    }

    if (!mongoose.isValidObjectId(contentId)) {
        throw new ApiError(400, "Invalid contentId");
    }

    const comment = await Comment.create({
        user: req.user._id,
        contentId,
        contentModel,
        text: text.trim(),
    });

    const populatedComment = await comment.populate("user", "username email avatar");

    return res.status(200)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();

    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment");
    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You cannot delete this comment");
    }

    await comment.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params; // or contentId
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const skip = (page - 1) * limit;

  const commentsAgg = await Comment.aggregate([
    {
      $match: {
        contentId: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: Number(limit) },
          {
            $lookup: {
              from: "users",
              localField: "user", 
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 1,
              text: 1,
              createdAt: 1,
              "user._id": 1,
              "user.username": 1,
              "user.email": 1,
              "user.avatar": 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const comments = commentsAgg[0].data;
  const total = commentsAgg[0].totalCount[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(200, {
      comments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    }, "Comments fetched successfully")
  );
});

module.exports = {
    addComment,
    updateComment,
    deleteComment,
    getComments
}