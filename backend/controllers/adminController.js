const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { 
sendRefundEmail,
sendOrderStatusEmail
} = require("../services/emailService");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
 role:"ADMIN"
      },
      process.env.JWT_SECRET || "bookstore_secret",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name AS user_name,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
exports.updateOrderStatus = async (req, res) => {

try {

const { id } = req.params;
const { status } = req.body;


// Get order details
const [orders] = await db.query(
`
SELECT 
o.*,
u.name AS user_name,
u.email
FROM orders o
JOIN users u
ON o.user_id=u.id
WHERE o.id=?
`,
[id]
);


if(orders.length===0){

return res.status(404).json({
message:"Order not found"
});

}


const order = orders[0];


// Prevent update cancelled order
if(order.status==="Cancelled"){

return res.status(400).json({
message:"Cancelled order status cannot be changed"
});

}
// Status Flow Validation

const statusFlow = {

"Placed": [
"Processing",
"Cancelled"
],

"Processing":[
"Shipped",
"Cancelled"
],

"Shipped":[
"Delivered",
"Cancelled"
],

"Delivered":[],

"Cancelled":[]

};


if(
!statusFlow[order.status].includes(status)
){

return res.status(400).json({

message:
`Cannot change status from ${order.status} to ${status}`

});

}


// Refund Logic
if(
status==="Cancelled" &&
order.payment_method==="ONLINE"
){

const refundId =
"REF_"+Date.now();


await db.query(
`
UPDATE orders
SET
status='Cancelled',
payment_status='Refunded',
refund_status='Refunded',
refund_id=?,
refund_amount=?,
refund_date=NOW()
WHERE id=?
`,
[
refundId,
order.total_price,
id
]
);


// Send refund email
await sendRefundEmail({

email:order.email,
name:order.user_name,
orderId:id,
refundId,
amount:order.total_price

});


}
else{


// Normal status update

await db.query(
`
UPDATE orders
SET status=?
WHERE id=?
`,
[
status,
id
]
);
await sendOrderStatusEmail({

email: order.email,

name: order.user_name,

orderId: id,

oldStatus: order.status,

newStatus: status

});

}



res.json({

message:"Order status updated"

});


}
catch(err){

console.log(err);

res.status(500).json({

message:"Server Error"

});

}

};
exports.getOrderDetails = async (req,res)=>{

try{

const {id}=req.params;


const [orders]=await db.query(
`
SELECT 
o.*,
u.name AS user_name,
u.email
FROM orders o
JOIN users u
ON o.user_id=u.id
WHERE o.id=?
`,
[id]
);


if(orders.length===0){

return res.status(404).json({
message:"Order not found"
});

}


const [items]=await db.query(
`
SELECT 
oi.quantity,
oi.price,
b.title,
b.author

FROM order_items oi

JOIN books b
ON oi.book_id=b.id

WHERE oi.order_id=?
`,
[id]
);


res.json({

order:orders[0],
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
module.exports = {
  login,
  getAllOrders: exports.getAllOrders,
  updateOrderStatus: exports.updateOrderStatus,
  getOrderDetails: exports.getOrderDetails
};
