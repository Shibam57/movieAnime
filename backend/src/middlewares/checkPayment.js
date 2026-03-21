import { hasUserPaid } from "../utils/paymentUtils.js";

export const checkPayment = (model) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;

        const content = await model.findById(id);
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.isPaid) {
            const paid = await hasUserPaid(userId, id);
            if (!paid) {
                return res.status(403).json({ message: "Please purchase this content" });
            }
        }

        req.content = content;
        next();
    };
};