const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied. No Token Provided."
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      message: "Invalid Token"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "bookstore_secret"
    );

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log("JWT Error:", err.message);

    return res.status(401).json({
      message: "Token Expired or Invalid"
    });

  }
};

module.exports = verifyUser;
