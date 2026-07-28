const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

const auth = require("../middleware/userAuthMiddleware");


// ==============================
// PLACE ORDER
// ==============================

router.post(
  "/place",
  auth,
  orderController.placeOrder
);


// ==============================
// USER ORDERS
// ==============================

router.get(
  "/",
  auth,
  orderController.getOrders
);


// ==============================
// ADMIN ALL ORDERS
// ==============================



// ==============================
// USER CANCEL ORDER
// ==============================

router.put(
  "/cancel/:id",
  auth,
  orderController.cancelOrder
);


// ==============================
// INVOICE
// ==============================

router.get(
  "/:id/invoice",
  auth,
  orderController.generateInvoice
);


// ==============================
// SINGLE ORDER DETAILS
// ==============================

router.get(
  "/:id",
  auth,
  orderController.getOrderDetails
);


module.exports = router;
