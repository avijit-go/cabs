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
  
  router.get("/search-cars", searchCars);
  router.post("/create", VerifyAdmin, createCarList);
  router.get("/list", getCarsList);
  router.get("/:id", getCarById);
  router.put("/update/:id",VerifyAdmin, updateCarDetails);
  router.delete("/delete/:id",VerifyAdmin, deleteCarDetails);
  
  module.exports = router;
  