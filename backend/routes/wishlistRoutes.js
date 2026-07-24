const express = require("express");

const router = express.Router();

const wishlistController = require("../controllers/wishlistController");

const auth = require("../middleware/userAuthMiddleware");

// Add to wishlist
router.post(
  "/",
  auth,
  wishlistController.addToWishlist
);

// Get wishlist
router.get(
  "/",
  auth,
  wishlistController.getWishlist
);

// Remove from wishlist
router.delete(
  "/:bookId",
  auth,
  wishlistController.removeWishlist
);

module.exports = router;
