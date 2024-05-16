const { createNewDriver, getDrivers,searchDriver } = require("../../controller/driver/driverController");
const VerifyAdmin = require("../../middleware/verifyAdmin")
const router = require("express").Router();

router.post("/create",  createNewDriver);
router.get("/list", getDrivers);
router.get("/serach-driver", searchDriver)
module.exports = router;