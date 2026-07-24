const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { uploadImage } = require("../controllers/uploadController");

const verifyToken = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  uploadImage
);

module.exports = router;
