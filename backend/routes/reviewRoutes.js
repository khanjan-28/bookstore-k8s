const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");

const auth = require("../middleware/authMiddleware");

// Add Review
router.post(
  "/:bookId",
  auth,
  reviewController.addReview
);

// Get Reviews
router.get(
  "/:bookId",
  reviewController.getReviews
);

module.exports = router;
