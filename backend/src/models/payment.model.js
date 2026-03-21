const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "contentModel"   
    },
    contentModel: {
        type: String,
        required: true,
        enum: ["Movie", "Series", "Episode"] 
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"   // you can change to USD/EUR etc.
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    method: {
        type: String,
        enum: ["UPI", "Card", "NetBanking", "Wallet", "PayPal", "Stripe", "Razorpay"],
        required: true,
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    transactionId: {
        type: String,
        default: () => "txn_" + Date.now(),
    }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment