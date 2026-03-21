// const Payment = require('../models/payment.model')
// const Movie = require('../models/movie.model')
// const Series = require('../models/series.model')
// const Episode = require('../models/episode.model')
// const asyncHandler = require('../utils/asyncHandler')
// const ApiError = require('../utils/ApiError')
// const ApiResponse = require('../utils/ApiResponse');
// const User = require("../models/user.model");


// const createPayment=asyncHandler(async(req, res)=>{
//     try {
//         console.log("👉 Incoming payment body:", req.body);
//         const { contentId, contentModel, amount, method, currency } = req.body
//         const userId = req.user._id;
        
//         let content;
//         if (contentModel === "Movie") content = await Movie.findById(contentId);
//         else if (contentModel === "Series") content = await Series.findById(contentId);
//         else if (contentModel === "Episode") content = await Episode.findById(contentId);

//         if(!content){
//             console.error(`Content lookup failed: ${contentModel} with ID ${contentId}`);
//             throw new ApiError(404, `${contentModel || "Content"} not found with ID: ${contentId}`)
//         }

//         const payment = await Payment.create({
//             user: userId,
//             contentId,
//             contentModel,
//             amount,
//             currency,
//             method,
//             paymentStatus: "success"
//         })

//         if(!payment){
//             throw new ApiError(404, "Payment not successfully")
//         }

//         await User.findByIdAndUpdate(userId, {
//             $addToSet: {
//                 purchasedContent: { contentId, contentModel },
//             },
//         });

//         return res.status(200)
//         .json(new ApiResponse(200, payment, "Payment successfully"))
//     } catch (error) {
//         console.error("Payment Error:", error)
//         throw new ApiError(500, error.message || "Payment failed")
//     }
// })

// const getUserPayments = asyncHandler(async(req, res)=>{
//     const userId = req.user._id;

//     const payments = await Payment.find({ 
//         user: userId,
//         paymentStatus: "success"
//     })
//     .sort({ createdAt: -1 })
//     .populate("contentId", "title thumbnail price")
//     .populate("user", "username email");

//     return res.status(200)
//     .json(new ApiResponse(200, payments, "payment successfully"))
// })

// const getAllPayments = asyncHandler(async(req, res)=>{
//     const payments = await Payment.find().populate("user", "username email").populate("contentId").sort({createdAt: -1})

//     return res.status(200)
//     .json(new ApiResponse(200, payments, "payment successfully"))
// })

// const checkAccess = async (req, res) => {
//   try {
//     const { contentId } = req.params;

//     const purchase = await Payment.findOne({
//       user: req.user._id,
//       contentId,
//       paymentStatus: "success",
//     });

//     res.json({ hasAccess: !!purchase });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = {
//     createPayment,
//     getUserPayments,
//     getAllPayments,
//     checkAccess
// }


const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
const Movie = require("../models/movie.model");
const Series = require("../models/series.model");
const Episode = require("../models/episode.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createOrder = asyncHandler(async (req, res) => {
  try {
    const { contentId, contentModel, amount, currency = "INR" } = req.body;
    const userId = req.user._id;

    // Check content exists
    let content;
    if (contentModel === "Movie") content = await Movie.findById(contentId);
    else if (contentModel === "Series") content = await Series.findById(contentId);
    else if (contentModel === "Episode") content = await Episode.findById(contentId);

    if (!content) {
      throw new ApiError(404, `${contentModel} not found with ID: ${contentId}`);
    }

    const options = {
      amount: amount * 100, 
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: userId,
      contentId,
      contentModel,
      amount: amount / 100,
      currency,
      method: "Razorpay",
      paymentStatus: "pending",
      razorpay_order_id: order.id,
    });

    return res.status(200).json(
      new ApiResponse(200, { order, paymentId: payment._id }, "Order created successfully")
    );
  } catch (error) {
    console.error("Create order error:", error);
    throw new ApiError(500, error.message || "Failed to create order");
  }
});


const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      throw new ApiError(400, "Missing required payment details");
    }

    // ✅ Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      throw new ApiError(400, "Invalid payment signature");
    }

    // ✅ Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: "success",
      },
      { new: true }
    );

    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    // ✅ Add content to user's purchased list
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        purchasedContent: { contentId: payment.contentId, contentModel: payment.contentModel },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment verified successfully"));
  } catch (error) {
    console.error("Payment verification error:", error);
    throw new ApiError(500, error.message || "Payment verification failed");
  }
});

/**
 * @desc Get logged-in user's payments
 * @route GET /api/payment/my
 */
const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const payments = await Payment.find({
    user: userId,
    paymentStatus: "success",
  })
    .sort({ createdAt: -1 })
    .populate("contentId", "title thumbnail price")
    .populate("user", "username email");

  return res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

/**
 * @desc Get all payments (admin)
 * @route GET /api/payment/all
 */
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "username email")
    .populate("contentId")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

/**
 * @desc Check if user has access to content
 * @route GET /api/payment/access/:contentId
 */
const checkAccess = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const purchase = await Payment.findOne({
    user: req.user._id,
    contentId,
    paymentStatus: "success",
  });

  res.json({ hasAccess: !!purchase });
});

module.exports = {
  createOrder,
  verifyPayment,
  getUserPayments,
  getAllPayments,
  checkAccess,
};