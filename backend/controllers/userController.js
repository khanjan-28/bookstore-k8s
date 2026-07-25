const sendEmail = require("../services/emailService");
const welcomeTemplate = require("../templates/welcomeTemplate");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= Register =================

const register = async (req, res) => {
  try {

const { email, password, phone } = req.body;

const name = email.split("@")[0];
    // Validation
if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Duplicate Email
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const [result] = await db.query(
      `INSERT INTO users
      (name,email,password,phone)
      VALUES (?,?,?,?)`,
      [
        name,
        email,
        hashedPassword,
        phone || null
      ]
    );

try {
  await sendEmail({
    to: email,
    subject: "Welcome to BookStore",
    html: welcomeTemplate(name)
  });

  console.log("Welcome email sent.");
} catch (err) {
  console.error("Welcome Email Error:", err.message);
}    
res.status(201).json({
      message: "Registration Successful",
      user: {
        id: result.insertId,
        name,
        email,
        phone
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "bookstore_secret",
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
const getProfile = async (req, res) => {
  try {

    const [rows] = await db.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
const updateProfile = async (req, res) => {

  try {

    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    await db.query(
      `UPDATE users
       SET name = ?, phone = ?
       WHERE id = ?`,
      [
        name,
        phone || null,
        req.user.id
      ]
    );

    res.json({
      message: "Profile Updated Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    const user = rows[0];

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current Password Incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    res.json({
      message: "Password Changed Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
