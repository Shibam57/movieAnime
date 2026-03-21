const express = require('express')
const upload = require('../middlewares/multer.middleware.js')
const verifyJWT =require('../middlewares/auth.middleware.js')
const {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser} = require("../controllers/user.controller");
const optionalVerifyAdminJWT = require("../middlewares/optionalVerifyAdminJWT.middleware.js")


const router = express.Router();

router.post('/register', upload.fields([{ 
    name: 'avatar',
    maxCount: 1
}]), registerUser)

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", verifyJWT, getCurrentUser);

module.exports = router;