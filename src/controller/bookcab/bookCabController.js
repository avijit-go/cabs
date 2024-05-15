/** @format */

const mongoose = require("mongoose");
const User = require("../../model/user/userSchema");
const BookCab = require("../../model/bookCab/bookCabSchema");
const createError = require("http-errors");
const { calculateTimeDiff } = require("../../helper/helper");

class BookCabController {
  /**
   * Creates a new booking for a cab ride.
   * Validates the request body for required fields.
   * Calculates cab fare based on distance and number of extra passengers.
   * Updates wallet points for the user.
   * @param {Object} req - Express request object containing the request body with travel details.
   * @param {Object} res - Express response object to send the response.
   * @param {Function} next - Express next function to pass control to the next middleware.
   * @returns {Object} - JSON response indicating the success of the booking and the booking details.
   */
  async createBookingCab(req, res, next) {
    try {
      // Check if required fields are present in the request body
      if (
        !req.body.travelDate.trim() ||
        !req.body.pickupTime.trim() ||
        !req.body.pickupLocation.trim() ||
        !req.body.dropLocation.trim()
      ) {
        throw createError.BadRequest({ message: "Invalid format" });
      }
      // calculate cab fare
      const distance = 2;
      const costPerKM = 100;
      const costPerExtraPessenger = 150;
      const cabFare =
        2 * costPerKM + costPerExtraPessenger * req.body.extraPassengers;

      // calculate wallet point
      const walletPoints = distance * 1;

      // Create new booking data object
      const newBookingData = BookCab({
        _id: new mongoose.Types.ObjectId(),
        user: req.user._id,
        travelDate: req.body.travelDate,
        pickupTime: req.body.pickupTime,
        pickupLocation: req.body.pickupLocation,
        dropLocation: req.body.dropLocation,
        luggage: req.body.luggage,
        extraPassengers: req.body.extraPassengers,
        extraPassengerFare: costPerExtraPessenger * req.body.extraPassengers,
        fare: cabFare,
        walletPoints,
        paymentStatus: req.body.paymentStatus,
      });

      // Save the new booking data
      const bookingData = await newBookingData.save();
      // Populate user details in booking data
      await bookingData.populate({
        path: "user",
        select: "name email phone profile_img",
      });

      // Update wallet points in user collection

      // Respond with success message and booking data
      return res
        .status(201)
        .json({ message: "Your cab booking is successfull", bookingData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a list of bookings associated with the logged-in user.
   * Accepts optional query parameters for pagination (page and limit).
   * Retrieves bookings from the database based on the user's ID.
   * Populates user details for each booking in the list.
   * Sorts the bookings based on creation date in descending order.
   * @param {Object} req - Express request object containing the query parameters for pagination.
   * @param {Object} res - Express response object to send the list of bookings.
   * @param {Function} next - Express next function to pass control to the next middleware.
   * @returns {Object} - JSON response containing the list of bookings associated with the user.
   */
  async getUserBookingList(req, res, next) {
    try {
      // Extract page and limit parameters from the request query, or use defaults
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const sortStatus = req.query.sortStatus || "all";
      if (sortStatus === "all") {
        // Retrieve list of bookings for the logged-in user with pagination
        const list = await BookCab.find({ user: req.user._id })
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      } else if (sortStatus === "active") {
        // Retrieve list of bookings for the logged-in user with pagination
        const list = await BookCab.find({
          $and: [{ user: req.user._id }, { status: "active" }],
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      } else {
        // Retrieve list of bookings for the logged-in user with pagination
        const list = await BookCab.find({
          $and: [{ user: req.user._id }, { status: "inactive" }],
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves details of a single booking based on the provided booking ID.
   * Validates the request parameter to ensure the presence of the booking ID.
   * Retrieves booking details from the database using the provided ID.
   * Populates user details associated with the booking.
   * @param {Object} req - Express request object containing the booking ID in the parameters.
   * @param {Object} res - Express response object to send the booking details.
   * @param {Function} next - Express next function to pass control to the next middleware.
   * @returns {Object} - JSON response containing the details of the single booking.
   */
  async getSingleBookingDetails(req, res, next) {
    try {
      // Validate the presence of the booking ID in the request parameters
      if (!req.params.id) {
        throw createError.BadRequest({ message: "Invalid request parameter" });
      }
      // Retrieve details of the single booking based on the provided ID
      const bookingData = await BookCab.findById(req.params.id).populate({
        path: "user",
        select: "profile_img name phone email",
      });
      // Respond with the booking details
      return res.status(200).json(bookingData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates details of a booking based on the provided booking ID.
   * Validates the request parameter to ensure the presence of the booking ID.
   * Validates the request body for required fields.
   * Retrieves booking details from the database using the provided ID.
   * Checks if the booking update is allowed based on a time difference condition.
   * Updates the booking details if the condition is met.
   * @param {Object} req - Express request object containing the booking ID in the parameters and updated details in the body.
   * @param {Object} res - Express response object to send the updated booking details.
   * @param {Function} next - Express next function to pass control to the next middleware.
   * @returns {Object} - JSON response indicating the success of the update and the updated booking details.
   */
  async updateBookingDetails(req, res, next) {
    try {
      // Validate the presence of the booking ID in the request parameters
      if (!req.params.id) {
        throw createError.BadRequest({ message: "Invalid request parameter" });
      }
      // Retrieve details of the booking based on the provided ID
      // const bookingData = await BookCab.findById(req.params.id);
      // Calculate time difference to check if the booking update is allowed
      // const timeDifference = await calculateTimeDiff(bookingData);
      // Check if the booking update is allowed based on a time difference condition
      // console.log(timeDifference);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a list of all bookings with optional pagination.
   * Accepts optional query parameters for pagination (page and limit).
   * Retrieves bookings from the database.
   * Populates user details for each booking in the list.
   * Sorts the bookings based on creation date in descending order.
   * @param {Object} req - Express request object containing the query parameters for pagination.
   * @param {Object} res - Express response object to send the list of bookings.
   * @param {Function} next - Express next function to pass control to the next middleware.
   * @returns {Object} - JSON response containing the list of bookings.
   */
  async getBookingList(req, res, next) {
    try {
      // Extract page and limit parameters from the request query, or use defaults
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const sortStatus = req.query.sortStatus || "all";

      if (sortStatus === "all") {
        // Retrieve list of bookings with pagination
        const list = await BookCab.find({})
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      } else if (sortStatus === "active") {
        // Retrieve list of bookings with pagination
        const list = await BookCab.find({ status: "active" })
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      } else {
        // Retrieve list of bookings with pagination
        const list = await BookCab.find({ status: "inactive" })
          .limit(limit)
          .skip((page - 1) * limit)
          .populate({
            path: "user",
            select: "name email phone profile_img",
          })
          .sort({ createdAt: -1 }); // Sort bookings based on creation date in descending order
        // Respond with the list of bookings
        return res.status(200).json(list);
      }
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      // Validate the presence of the booking ID in the request parameters
      if (!req.params.id) {
        throw createError.BadRequest({ message: "Invalid request parameter" });
      }
      // Retrieve details of the booking based on the provided ID
      const bookingData = await BookCab.findById(req.params.id);
      // Calculate time difference to check if the booking update is allowed
      const timeDifference = await calculateTimeDiff(bookingData);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new BookCabController();
