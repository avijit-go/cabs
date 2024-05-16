const mongoose = require("mongoose");

const DriverSchema= mongoose.Schema({
    _id: {type: mongoose.Types.Schema.ObjectId},
    name: {type: String, trim: true},
    email: {type: String, trim: true},
    phone: {type: String, trim :true},
    drivingLicense: {type: String, trim: true},
    profile_image: {type: String, trim: true, default: ""}
}, {createdAt: true});

module.exports = mongoose.model("Driver", DriverSchema)