const User = require("../models/User");

// ✅ Update FCM Token on Login
const updateFCMToken = async (req, res) => {
  const { fcmToken } = req.body;
  const userId = req.user.id; // Extract user ID from JWT

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add token if not already in array
    if (!user.fcmTokens.includes(fcmToken)) {
      user.fcmTokens.push(fcmToken);
      await user.save();
    }

    res.status(200).json({ message: "FCM Token updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating FCM Token", error });
  }
};

// ✅ Remove FCM Token on Logout
const removeFCMToken = async (req, res) => {
  const { fcmToken } = req.body;
  const userId = req.user.id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fcmTokens = user.fcmTokens.filter(token => token !== fcmToken);
    await user.save();

    res.status(200).json({ message: "FCM Token removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing FCM Token", error });
  }
};

module.exports = { updateFCMToken, removeFCMToken };
