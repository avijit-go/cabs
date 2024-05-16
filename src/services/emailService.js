/** @format */

const createHttpError = require("http-errors");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "tyree.gleichner11@ethereal.email",
    pass: "gSbuywTTDVwkNY7D4P",
  },
});

class EmailService {
  constructor() {}

  async sendEmailOtp(email, generateOTP) {
    try {
      const info = await transporter.sendMail({
        from: "marjorie.bogan28@ethereal.email", // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        text: "", // plain text body
        html: `<p>Your email verification OTP is ${generateOTP}</p>`, // html body
      });
      console.log(info.messageId);
      return info;
    } catch (error) {
      throw createHttpError.BadRequest({ message: error.message });
    }
  }

  async sendVerificationEmail(email, key) {
    try {
      const info = await transporter.sendMail({
        from: "marjorie.bogan28@ethereal.email", // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        text: "", // plain text body
        html: `<p>Your email verification Key is ${key}</p>`, // html body
      });
      console.log(info.messageId);
      return info;
    } catch (error) {
      throw createHttpError.BadRequest({ message: error.message });
    }
  }
}
module.exports = new EmailService();
