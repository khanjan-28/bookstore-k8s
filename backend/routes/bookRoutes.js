const express = require("express");

const router = express.Router();

const controller = require("../controllers/bookController");

const verifyToken = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get("/", controller.getBooks);

router.get("/search", controller.searchBooks);

router.get("/stats/dashboard", controller.getDashboardStats);

router.get("/:id", controller.getBook);

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  controller.addBook
);

router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  controller.updateBook
);

router.delete("/:id", verifyToken, controller.deleteBook);

module.exports = router;
