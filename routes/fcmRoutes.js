const express = require("express");
const { updateFCMToken, removeFCMToken } = require("../controllers/fcmController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/update-fcm-token", protect, updateFCMToken);
router.post("/remove-fcm-token", protect, removeFCMToken);

module.exports = router;
