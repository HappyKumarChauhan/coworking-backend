const express = require("express");
const { notifyOwnerOnBooking } = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/send-notification", protect, notifyOwnerOnBooking);

module.exports = router;
