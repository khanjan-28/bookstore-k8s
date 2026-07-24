const express = require("express");
const router = express.Router();

const {
  login,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");


router.post("/login", login);


// Admin Orders
router.get("/orders", auth, getAllOrders);

router.put("/orders/:id", auth, updateOrderStatus);

router.get("/orders/:id", auth, getOrderDetails);


module.exports = router;
