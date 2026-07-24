require("dotenv").config();

const express = require("express");
const cors = require("cors");
const reviewRoutes = require("./routes/reviewRoutes");
const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);
// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "UP",
        service: "Book Store API"
    });
});

// API Routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
