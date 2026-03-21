const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentType: {
    type: String,
    enum: ["series", "season", "episode"],
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;