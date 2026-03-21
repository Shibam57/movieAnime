const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} = require("../controllers/admin.controller");
const verifyAdminJWT =require('../middlewares/admin.middleware.js')

const router = express.Router();

router.post("/admin-register", registerAdmin);
router.post("/admin-login", loginAdmin);
router.post("/admin-logout", verifyAdminJWT, logoutAdmin);
router.get("/admin-profile", verifyAdminJWT, getCurrentAdmin);

module.exports = router