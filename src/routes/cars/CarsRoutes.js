/** @format */

const {
    createCarList,
    getCarsList,
    searchCars,
    getCarById,
    updateCarDetails,
    deleteCarDetails,
  } = require("../../controller/cars/carsController");
  const VerifyAdmin = require("../../middleware/verifyAdmin");
  const router = require("express").Router();
  
  router.post("/create", VerifyAdmin, createCarList);
  router.get("/list", getCarsList);
  router.get("/search-cars", searchCars);
  router.get("/:id", getCarById);
  router.put("/update/:id", updateCarDetails);
  router.delete("/delete/:id", deleteCarDetails);
  
  module.exports = router;
  