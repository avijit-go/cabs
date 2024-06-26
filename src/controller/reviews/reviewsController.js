const createError = require("http-errors");
const mongoose = require("mongoose");
const Cars = require("../../model/cars/carsSchema");
const Reviews = require("../../model/reviews/reviews");

class ReviewsController {
    constructore() {}

    /**
        * Create a review for a car.
        * @param {Object} req - The request object.
        * @param {Object} res - The response object.
        * @param {function} next - The next middleware function.
        * @throws {Error} Throws an error if the car ID is not provided or if the request body's content is invalid.
        * @returns {Object} Returns a JSON object with a success message and the created review data.
    */
    async createReview(req, res, next) {
        try {
            // Extract car ID from request parameters
            const carID = req.params.carId;
            // Check if car ID is provided
            if (!carID) {
                throw createError.BadRequest({ message: "Car ID not provided" });
            } 
             // Check if request body's content is provided and valid
            else if (!req.body.content || !req.body.content.trim()) {
                throw createError.BadRequest({ message: "Invalid request" });
            }

            // Create review object
            const reviewObj = Reviews({
                _id: new mongoose.Types.ObjectId(),
                content: req.body.content,
                user: req.user._id, // User ID is retrieved from authentication token
                car: carID
            });
        
            // Save review data in the database
            const reviewData = await reviewObj.save();
            // Update review ID in cars collection
            const updateCars = await Cars.findByIdAndUpdate(
                carID,
                { $addToSet: { reviews: reviewObj._id } },
                { new: true }
            );
            // Return success response with created review data
            return res.status(201).json({ message: "Successfully submitted your review", review: reviewData });
        } 
        catch (error) {
        next(error);
    }
}


    /**
    * Retrieve reviews for a specific car.
    * @param {Object} req - The request object.
     * @param {Object} res - The response object.
    * @param {function} next - The next middleware function.
    * @throws {Error} Throws an error if the car ID is not provided.
    * @returns {Object} Returns a JSON object containing reviews for the specified car.
    */
    async getAllreviews(req, res, next) {
        try {
            // Extract car ID from request parameters
            const carID = req.params.carId;
            if(!carID) {
                throw createError.BadRequest({message: "Car id not provided"});
            } 
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const reviews = await Reviews.find({car: carID})
                .populate({path: "user", select: 'name profile_img'})
                .limit(limit)
                .skip((page-1)*limit)
                .sort({createdAt: -1})
            return res.status(200).json(reviews);
        }
        catch(error) {
            next(error)
        }
    }

    // edit review
    async updateReview(req, res, next) {
        try {
            const id = req.params.id;
            const {content} = req.body;
            if(!id) {
                throw createError.BadRequest({message: "Review ID not found"})
            }
            if(!content || !content.trim()) {
                throw createError.BadRequest({message: "Invalid content"})
            }
            const updateReview = await Reviews.findByIdAndUpdate(id, {$set: {content: content}}, {new: true});
            return res.status(200).json({message: 'Review has been updated', data: updateReview})
        }
        catch(error) {
            next(error)
        }
    }

    // delete review from admin or user 
    async deleteReview(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                throw createError.BadRequest({message: "Invalid review id provided"})
            }
            const reviewData = await Reviews.findById(id);
            await Reviews.findByIdAndDelete(id);
            await Cars.findByIdAndUpdate(reviewData.car, {$pull: {reviews: id}}, {new: true});
            return res.status(200).json({message: "Review successfully deleted"})
        }
        catch(error) {
            next(error)
        }
    }
}

module.exports = new ReviewsController()