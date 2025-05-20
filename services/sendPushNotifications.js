const User = require('../models/User')
const admin=require('../config/firebase')

// ✅ Function to send notification
const sendPushNotification = async (userId, title, body) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.fcmTokens.length === 0) {
      console.log("No FCM tokens found for this user.");
      return;
    }

    const message = {
      notification: { title, body },
      tokens: user.fcmTokens, // Send to multiple devices
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = sendPushNotification;
