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


    if(cartItems.length === 0){

      return res.status(400).json({
        message:"Cart is empty"
      });

    }


    const total = cartItems.reduce(
      (sum,item)=>
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



    for(const item of cartItems){

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

      message:"Order placed successfully",

      orderId:order.insertId

    });



  }
  catch(err){

    console.log(err);

    res.status(500).json({
      message:"Server Error"
    });

  }

};



// ==============================
// GET MY ORDERS
// ==============================

exports.getOrders = async(req,res)=>{


  try{


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
  catch(err){


    console.log(err);


    res.status(500).json({

      message:"Server Error"

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
	 orders.status,
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



    if(orders.length === 0){


      return res.status(404).json({

        message:"Order not found"

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
  catch(err){


    console.log(err);


    res.status(500).json({

      message:"Server Error"

    });


  }


};

// ==============================
// GENERATE PREMIUM INVOICE PDF
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

      ON users.id = orders.user_id


      WHERE orders.id=?

      AND orders.user_id=?

      `,

      [
        orderId,
        userId
      ]

    );



    if(orders.length===0){

      return res.status(404).json({

        message:"Order not found"

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

      ON books.id = order_items.book_id


      WHERE order_items.order_id=?

      `,

      [
        orderId
      ]

    );



    const order = orders[0];
const invoiceNumber =
"INV-" + Math.floor(100000 + Math.random() * 900000);


    res.setHeader(
      "Content-Type",
      "application/pdf"
    );


    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.id}.pdf`
    );



    const doc = new PDFDocument({

      size:"A4",

margin:30
    });



    doc.pipe(res);



    const BLUE = "#2563eb";
    const LIGHT = "#f8fafc";
    const GREEN = "#16a34a";
    const BORDER = "#d1d5db";



    // HEADER

    doc
      .rect(0,0,595,100)
      .fill(BLUE);



    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(28)
      .text(
        "BOOKSTORE",
        0,
        30,
        {
          align:"center"
        }
      );


    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "Premium Books & Digital Library",
        {
          align:"center"
        }
      );



    doc.fillColor("black");

    doc.y=125;



    // TITLE

doc
  .font("Helvetica-Bold")
  .fontSize(24)
  .text(
    "INVOICE",
    0,
    125,
    {
      align:"center",
      width:595
    }
  );


    doc.moveDown();



    // INFO BOX


    const infoY = doc.y;


    doc
      .roundedRect(
        40,
        infoY,
        515,
        60,
        8
      )
      .fillAndStroke(
        LIGHT,
        BORDER
      );


    doc
      .fillColor("black")
      .font("Helvetica")
      .fontSize(11);



doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .text(
    `Invoice Number : ${invoiceNumber}`,
    55,
    infoY+18
  );


doc
  .font("Helvetica")
  .fontSize(11)
  .text(
    "Invoice By : BOOKSTORE",
    55,
    infoY+38
  );


doc.y = infoY+90;


// CUSTOMER + ORDER DETAILS BOX

const boxY = doc.y;


// CUSTOMER BOX

doc
  .roundedRect(
    40,
    boxY,
    245,
    120,
    8
  )
  .fillAndStroke(
    LIGHT,
    BORDER
  );


doc
  .fillColor("black")
  .font("Helvetica-Bold")
  .fontSize(12)
  .text(
    "Customer Details",
    55,
    boxY+15
  );


doc
  .font("Helvetica")
  .fontSize(9)
  .text(
    `Name : ${order.name}`,
    55,
    boxY+40
  )
  .text(
    `Email : ${order.email}`,
    55,
    boxY+58
  )
  .text(
    `Phone : ${order.phone}`,
    55,
    boxY+76
  )
  .text(
    `Address : ${order.address}`,
    55,
    boxY+94
  );



// ORDER DETAILS BOX

doc
  .roundedRect(
    310,
    boxY,
    245,
    120,
    8
  )
  .fillAndStroke(
    LIGHT,
    BORDER
  );


doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .fillColor("#000000")
  .text(
    "Order Details",
    325,
    boxY+15
  );

doc
  .font("Helvetica")
  .fontSize(9)
  .fillColor("#000000")
  .text(
    `Order ID : #${order.id}`,
    325,
    boxY+40
  )
  .text(
    `Order Date : ${new Date(order.created_at).toLocaleDateString()}`,
    325,
    boxY+58
  )
.text(
  `Payment Mode : ${order.payment_method || "COD"}`,
  325,
  boxY+76
);





doc.y = boxY+130;


    // TABLE


    const tableY = doc.y;



    doc
      .rect(
        40,
        tableY,
        515,
        30
      )
      .fill(BLUE);



    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(11);



    doc.text("Book",50,tableY+9);

    doc.text("Qty",350,tableY+9);

doc.text("Price",440,tableY+9);



    let y = tableY+40;



    items.forEach((item)=>{





      doc
        .fillColor("black")
        .font("Helvetica")
        .fontSize(10);



      doc.text(
        item.title,
        50,
        y
      );


      doc.text(
        item.quantity,
        350,
        y
      );


      doc.text(
        `Rs. ${Number(item.price).toFixed(2)}`,
        430,
        y
      );





      y +=30;


    });




    // TOTAL BOX


// GRAND TOTAL


const totalY = y + 20;


doc
  .roundedRect(
    330,
    totalY,
    225,
    70,
    8
  )
  .fill(BLUE);


doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(12)
  .text(
    "GRAND TOTAL",
    350,
    totalY+12
  );


doc
  .fontSize(18)
  .text(
    `Rs. ${Number(order.total_price).toFixed(2)}`,
    350,
    totalY+38
  );



// THANK YOU FOOTER

doc
  .fillColor("black")
  .font("Helvetica-Bold")
  .fontSize(14)
  .text(
    "Thank You For Your Purchase",
    0,
    760,
    {
      align:"center",
      width:595
    }
  );
    doc.end();



  }
  catch(err){


    console.log(err);


    res.status(500).json({

      message:"Invoice Error"

    });


  }


};
