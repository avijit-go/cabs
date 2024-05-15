/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

class Helper {
  constructor() {}

  async hashPassword(password) {
    try {
      const hashPass = await bcrypt.hash(password, 10);
      return hashPass;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async comparePassword(password, user) {
    try {
      const result = await bcrypt.compare(password, user.password);
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateAccessToken(body) {
    try {
      const token = await jwt.sign(
        {
          _id: body._id,
          email: body.email,
          name: body.name,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateRefreshToken(body) {
    try {
      const token = await jwt.sign(
        {
          _id: body._id,
          email: body.email,
          name: body.name,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "90d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async uploadImage(image) {
    try {
      const result = await cloudinary.uploader.upload(image.tempFilePath);
      return result.url;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateKey(email) {
    try {
      const token = await jwt.sign(
        {
          email: email,
        },
        "secret_key_2024",
        { expiresIn: "1d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateAdminAccessToken(body) {
    try {
      const token = await jwt.sign(
        {
          _id: body._id,
          email: body.email,
          isAdmin: body.isAdmin,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateAdminRefreshToken(body) {
    try {
      const token = await jwt.sign(
        {
          _id: body._id,
          email: body.email,
          isAdmin: body.isAdmin,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "90d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async calculateTimeDiff(data) {
    try {
      const travelDateStr = data.travelDate;
      const pickupTimeStr = data.pickupTime;

      // Parse the date and time strings
      const [day, month, year] = travelDateStr.split("-");
      const [hours, minutes] = pickupTimeStr.split(":");
      const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
      const timestamp = date.getTime();
      const currentTimeStamp = Date.now();
      const difference = timestamp - currentTimeStamp;
      const hoursDifference = difference / (1000 * 60 * 60);

      return hoursDifference;
    } catch (error) {
      throw createError.BadRequest({ message: error.message });
    }
  }
}

module.exports = new Helper();
