const express = require("express");

const router = express.Router();

const verifyUser = require("../middleware/userAuthMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/userController");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", verifyUser, getProfile);

router.put("/profile", verifyUser, updateProfile);

router.put("/change-password", verifyUser, changePassword);

module.exports = router;
