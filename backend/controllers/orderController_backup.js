const db = require("../config/db");
const PDFDocument = require("pdfkit");

// ==============================
// PLACE ORDER
// ==============================

exports.placeOrder = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      payment
    } = req.body;

    const [cartItems] = await db.query(
      `
      SELECT
        cart.book_id,
        cart.quantity,
        books.price
      FROM cart
      JOIN books
      ON cart.book_id = books.id
      WHERE cart.user_id=?
      `,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const total = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.quantity,
      0
    );

    const [order] = await db.query(
      `
      INSERT INTO orders
      (
        user_id,
        total_price,
        full_name,
        phone,
        address,
        city,
        state,
        pincode,
        payment_method
      )
      VALUES(?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        total,
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        payment
      ]
    );

    for (const item of cartItems) {

      await db.query(
        `
        INSERT INTO order_items
        (
          order_id,
          book_id,
          quantity,
          price
        )
        VALUES(?,?,?,?)
        `,
        [
          order.insertId,
          item.book_id,
          item.quantity,
          item.price
        ]
      );

    }

    await db.query(
      "DELETE FROM cart WHERE user_id=?",
      [userId]
    );

    res.json({
      message: "Order placed successfully",
      orderId: order.insertId
    });

  }
  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

// ==============================
// GET MY ORDERS
// ==============================
// ==============================
// GET MY ORDERS
// ==============================

exports.getOrders = async (req, res) => {

  try {

    const [orders] = await db.query(
      `
      SELECT
        id,
        total_price,
        status,
        created_at
      FROM orders
      WHERE user_id=?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(orders);

  }
  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};


// ==============================
// GET SINGLE ORDER
// ==============================

exports.getOrderDetails = async (req, res) => {

  try {

    const orderId = req.params.id;
    const userId = req.user.id;

    const [orders] = await db.query(
      `
      SELECT
        orders.id,
        orders.total_price,
        orders.status,
        orders.created_at,

        orders.full_name,
        orders.phone,
        orders.address,
        orders.city,
        orders.state,
        orders.pincode,
        orders.payment_method,

        users.name,
        users.email

      FROM orders

      JOIN users
      ON orders.user_id = users.id

      WHERE orders.id=?
      AND orders.user_id=?
      `,
      [
        orderId,
        userId
      ]
    );

    if (orders.length === 0) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    const [items] = await db.query(
      `
      SELECT

        books.title,

        order_items.quantity,
        order_items.price

      FROM order_items

      JOIN books
      ON order_items.book_id = books.id

      WHERE order_items.order_id=?
      `,
      [
        orderId
      ]
    );

    res.json({

      order: orders[0],
      items

    });

  }
  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};


// ==============================
// GENERATE INVOICE PDF
// ==============================
exports.generateInvoice = async (req, res) => {

  try {

    const orderId = req.params.id;
    const userId = req.user.id;

    const [orders] = await db.query(
      `
      SELECT
        orders.id,
        orders.total_price,
        orders.created_at,

        orders.full_name,
        orders.phone,
        orders.address,
        orders.city,
        orders.state,
        orders.pincode,
        orders.payment_method,

        users.name,
        users.email

      FROM orders

      JOIN users
      ON orders.user_id = users.id

      WHERE orders.id=?
      AND orders.user_id=?
      `,
      [
        orderId,
        userId
      ]
    );

    if (orders.length === 0) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    const [items] = await db.query(
      `
      SELECT
        books.title,
        order_items.quantity,
        order_items.price

      FROM order_items

      JOIN books
      ON order_items.book_id = books.id

      WHERE order_items.order_id=?
      `,
      [
        orderId
      ]
    );

    const order = orders[0];

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.id}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    doc.pipe(res);

    // ================= HEADER =================

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("BOOKSTORE", {
        align: "center"
      });

    doc
      .font("Helvetica")
      .fontSize(11)
      .text("Premium Books & Digital Library", {
        align: "center"
      });

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("INVOICE");

    doc.moveDown();

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Invoice No : #${order.id}`)
      .text(`Date : ${new Date(order.created_at).toDateString()}`)
      .text(`Payment : ${order.payment_method}`);

    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("Customer Details");

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(order.name)
      .text(order.email);

    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("Shipping Address");

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(order.full_name)
      .text(order.phone)
      .text(order.address)
      .text(`${order.city}, ${order.state} - ${order.pincode}`);

    doc.moveDown(2);

    // ===== ITEMS TABLE START =====    // Table Header
// ===== ORDER ITEMS =====

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("Order Items");

doc.moveDown(0.8);

const startX = 50;
const qtyX = 310;
const priceX = 380;
const totalX = 470;
    doc
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Book Name", startX);
    doc.text("Qty", qtyX, doc.y - 12);
    doc.text("Price", priceX, doc.y - 12);
    doc.text("Total", totalX, doc.y - 12);

    doc.moveDown(0.5);

    doc
      .moveTo(startX, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(0.7);

    doc.font("Helvetica");

    items.forEach((item) => {

      const lineTotal =
        Number(item.price) * Number(item.quantity);

      const y = doc.y;

      doc.text(
        item.title,
        startX,
        y,
        {
          width: 250
        }
      );

      doc.text(
        String(item.quantity),
        qtyX,
        y
      );

      doc.text(
        `Rs. ${item.price}`,
        priceX,
        y
      );

      doc.text(
        `Rs. ${lineTotal.toFixed(2)}`,
        totalX,
        y,
        {
          align: "right"
        }
      );

      doc.moveDown();
    });

    doc
      .moveTo(startX, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        `Grand Total : Rs. ${order.total_price}`,
        {
          align: "right"
        }
      );

    doc.moveDown(2);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        "Payment Status : PAID / COD",
        {
          align: "center"
        }
      );

    doc.moveDown(0.5);

    doc.text(
      "Thank you for shopping with BOOKSTORE!",
      {
        align: "center"
      }
    );

    doc.end();

  }
  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Invoice Error"
    });

  }

};
