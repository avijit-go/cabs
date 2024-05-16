/** @format */

const router = require("express").Router();
const {
  createBookingCab,
  getUserBookingList,
  getSingleBookingDetails,
  updateBookingDetails,
  getBookingList,
  cancelBooking,
  claimToken,
} = require("../../controller/bookcab/bookCabController");
const Authentication = require("../../middleware/authentication");
const VerifyAdmin = require("../../middleware/verifyAdmin")


/**
 * POST route to create a new booking for a cab ride.
 * Requires authentication middleware to ensure the user is logged in.
 * Calls the createBookingCab function to handle the creation of the booking.
 * @name POST /create
 * @function
 * @memberof router
 * @param {string} path - Express path
 * @param {Function} middleware - Authentication middleware to verify user session
 * @param {Function} handler - Function to handle the creation of the booking
 */
router.post("/create", Authentication, createBookingCab);

/**
 * PUT route to update details of a specific booking.
 * Requires authentication middleware to ensure the user is logged in.
 * Calls the updateBookingDetails function to handle the updating of the booking details.
 * @name PUT /update-details/:id
 * @function
 * @memberof router
 * @param {string} path - Express path with a dynamic parameter ":id" representing the booking ID
 * @param {Function} middleware - Authentication middleware to verify user session
 * @param {Function} handler - Function to handle the updating of the booking details
 */
router.put("/update-details/:id", Authentication, updateBookingDetails);

router.put("/cancel/:id", Authentication, cancelBooking);

/**
 * GET route to retrieve a list of bookings associated with the logged-in user.
 * Requires authentication middleware to ensure the user is logged in.
 * Calls the getUserBookingList function to handle the retrieval of the user's booking list.
 * @name GET /user-booking-list
 * @function
 * @memberof router
 * @param {string} path - Express path
 * @param {Function} middleware - Authentication middleware to verify user session
 * @param {Function} handler - Function to handle the retrieval of the user's booking list
 */
router.get("/user-booking-list", Authentication, getUserBookingList);

/**
 * GET route to retrieve a list of all bookings.
 * Requires authentication middleware to ensure the user is logged in.
 * Calls the getBookingList function to handle the retrieval of the booking list.
 * @name GET /booking-list
 * @function
 * @memberof router
 * @param {string} path - Express path
 * @param {Function} middleware - Authentication middleware to verify user session
 * @param {Function} handler - Function to handle the retrieval of the booking list
 */
router.get("/list", Authentication, getBookingList);

/**
 * GET route to retrieve details of a specific booking by its ID.
 * Requires authentication middleware to ensure the user is logged in.
 * Calls the getSingleBookingDetails function to handle the retrieval of the booking details.
 * @name GET /:id
 * @function
 * @memberof router
 * @param {string} path - Express path with a dynamic parameter ":id" representing the booking ID
 * @param {Function} middleware - Authentication middleware to verify user session
 * @param {Function} handler - Function to handle the retrieval of the booking details
 */
router.get("/:id", Authentication, getSingleBookingDetails);

router.put("/claim/:id", Authentication, claimToken); // pass booking id as parameter
module.exports = router;
