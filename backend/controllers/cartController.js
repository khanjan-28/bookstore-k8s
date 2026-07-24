const db = require("../config/db");

// Add To Cart
exports.addToCart = async (req, res) => {

  try {

const { bookId, quantity } = req.body;
    const user_id = req.user.id;

    // Check if already exists
const [existing] = await db.query(
  "SELECT * FROM cart WHERE user_id=? AND book_id=?",
  [user_id, bookId]
);
    if (existing.length > 0) {

      await db.query(
        "UPDATE cart SET quantity=quantity+1 WHERE id=?",
        [existing[0].id]
      );

      return res.json({
        message: "Cart updated successfully"
      });

    }

await db.query(
  "INSERT INTO cart(user_id,book_id,quantity) VALUES(?,?,?)",
  [user_id, bookId, quantity || 1]
);
    res.json({

      message: "Book added to cart"

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Server Error"

    });

  }

};
// Increase Quantity

exports.increaseQuantity = async(req,res)=>{

try{

await db.query(
"UPDATE cart SET quantity = quantity + 1 WHERE id=? AND user_id=?",
[
req.params.id,
req.user.id
]
);


res.json({
message:"Quantity increased"
});


}catch(err){

console.log(err);

res.status(500).json({
message:"Server Error"
});

}

};




// Decrease Quantity

exports.decreaseQuantity = async(req,res)=>{

try{


await db.query(
"UPDATE cart SET quantity = IF(quantity>1, quantity-1,1) WHERE id=? AND user_id=?",
[
req.params.id,
req.user.id
]
);


res.json({
message:"Quantity decreased"
});


}catch(err){

console.log(err);

res.status(500).json({
message:"Server Error"
});

}

};




// Remove Cart Item

exports.removeFromCart = async(req,res)=>{

try{


await db.query(
"DELETE FROM cart WHERE id=? AND user_id=?",
[
req.params.id,
req.user.id
]
);


res.json({
message:"Item removed"
});


}catch(err){

console.log(err);

res.status(500).json({
message:"Server Error"
});

}

};
// Get User Cart
exports.getCart = async (req, res) => {

  try {

    const [rows] = await db.query(

      `SELECT
        cart.id,
        cart.quantity,
        books.id AS book_id,
        books.title,
        books.author,
        books.price,
        books.image
      FROM cart
      JOIN books
      ON cart.book_id = books.id
      WHERE cart.user_id = ?`,

      [req.user.id]

    );

    res.json(rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
