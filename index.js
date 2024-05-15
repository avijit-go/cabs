/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
require("./src/database/mongoDB");
const fileUpload = require("express-fileupload");
const createError = require("http-errors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const port = process.env.PORT || 5050;

// user routes
app.use("/api/user", require("./src/routes/users/userRoutes"));
// admin routes
app.use("/api/admin", require("./src/routes/admin/adminRoutes"));
// booking cab route
app.use("/api/booking", require("./src/routes/bookCab/bookCabroutes"));

app.use("/api/car", require("./src/routes/cars/CarsRoutes"));

app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});
// Error message
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
