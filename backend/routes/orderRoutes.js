const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

const auth = require("../middleware/userAuthMiddleware");


router.post(
  "/place",
  auth,
  orderController.placeOrder
);


router.get(
  "/",
  auth,
  orderController.getOrders
);

router.get(
  "/:id/invoice",
  auth,
  orderController.generateInvoice
);
router.get(
  "/:id",
  auth,
  orderController.getOrderDetails
);


module.exports = router;
