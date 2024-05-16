const router = require("express").Router();
const { createReview, getAllreviews, updateReview, deleteReview } = require("../../controller/reviews/reviewsController");
const Authentication = require("../../middleware/authentication");
const VerifyAdmin = require("../../middleware/verifyAdmin");

router.post("/create/:carId", Authentication, createReview);
router.get("/:carId", getAllreviews);
router.patch("/update/:id",Authentication, updateReview);
router.delete("/delete/:id",Authentication, deleteReview)

module.exports = router;