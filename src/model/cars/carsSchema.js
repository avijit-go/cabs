/** @format */

const mongoose = require("mongoose");

const CarSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: {
      type: String,
      default: "",
      required: [true, "Car name is required"],
    },
    description: {
      type: String,
      default: "",
      required: [true, "Car description is required"],
    },
    image: {
      type: String,
      default: "",
    },
    seats: {
      type: Number,
      required: [true, "Car number of seats are required"],
    },
    max_weight: {
      type: Number,
      required: [true, "Maximum weight can carried by car is required"],
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    type: {
      type: String,
      default: "SUV",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cars", CarSchema);
