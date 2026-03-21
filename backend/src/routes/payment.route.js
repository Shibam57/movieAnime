const express = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const verifyAdminJWT =require('../middlewares/admin.middleware.js')
const { getUserPayments, getAllPayments, checkAccess, createOrder, verifyPayment } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-payments", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);

router.get("/user-payments", verifyJWT, getUserPayments);

router.get("/alladmin-payments", verifyAdminJWT, getAllPayments);

router.get("/access/:contentId", verifyJWT, checkAccess);

module.exports = router