const mongoose = require("mongoose");

const ReviewsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: {type: String, trim: true, require: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    car: {type: mongoose.Schema.Types.ObjectId, ref: "Cars"},
}, {timestamps: true});

module.exports = mongoose.model("Review", ReviewsSchema)