const sendPushNotification = require('../services/sendPushNotifications')
const Booking = require("../models/Booking");
const Property = require("../models/Property");

// ✅ Send notification when booking is made
const notifyOwnerOnBooking = async (req, res) => {
  const { propertyId, userId, startDate, endDate } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const newBooking = await Booking.create({
      propertyId, userId, startDate, endDate, status: "pending",
    });

    // Send push notification to property owner
    await sendPushNotification(
      property.ownerId,
      "New Booking Request",
      "A user has requested to book your property."
    );

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

module.exports = { notifyOwnerOnBooking };