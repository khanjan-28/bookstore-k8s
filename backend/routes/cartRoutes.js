const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cartController");

const auth = require("../middleware/userAuthMiddleware");


// Add To Cart
router.post(
  "/",
  auth,
  cartController.addToCart
);


// Get Cart
router.get(
  "/",
  auth,
  cartController.getCart
);


// Increase Quantity
router.put(
  "/increase/:id",
  auth,
  cartController.increaseQuantity
);


// Decrease Quantity
router.put(
  "/decrease/:id",
  auth,
  cartController.decreaseQuantity
);


// Remove Item
router.delete(
  "/:id",
  auth,
  cartController.removeFromCart
);


module.exports = router;
