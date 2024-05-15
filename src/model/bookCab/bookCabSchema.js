/** @format */

const mongoose = require("mongoose");

const BookCabSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who made the booking
    travelDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    luggage: { type: Number, default: 0 },
    extraPassengers: { type: Number, default: 0, max: 2 },
    extraPassengerFare: { type: Number, default: 0 }, // Extra fare for additional passengers
    fare: { type: Number, required: true }, // Fare calculated based on total distance
    bookingDetails: { type: String }, // Additional booking details
    walletPoints: { type: Number, default: 0 }, // User's wallet points
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    }, // Payment status
    paymentMethod: { type: String }, // Payment method used
    paymentDate: { type: Date }, // Date of payment
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BookCab", BookCabSchema);
