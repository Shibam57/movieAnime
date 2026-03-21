import Payment from "../models/payment.model.js";

/**
 * Check if a user has purchased a specific content
 * @param {String} userId - The ID of the user
 * @param {String} contentId - The ID of the content (Movie/Series/Season/Episode)
 * @returns {Boolean} true if paid, false otherwise
 */
export const hasUserPaid = async (userId, contentId) => {
    const payment = await Payment.findOne({
        user: userId,
        contentId: contentId,
        paymentStatus: "success"
    });

    return !!payment;
}