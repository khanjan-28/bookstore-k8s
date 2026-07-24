const db = require("../config/db");

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {

    const userId = req.user.id;
    const { bookId } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM wishlist WHERE user_id=? AND book_id=?",
      [userId, bookId]
    );

    if (existing.length > 0) {
      return res.json({
        message: "Already in wishlist"
      });
    }

    await db.query(
      "INSERT INTO wishlist(user_id,book_id) VALUES(?,?)",
      [userId, bookId]
    );

    res.json({
      message: "Added to wishlist"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {

  try {

    const [rows] = await db.query(

      `SELECT
        wishlist.id,
        books.id AS book_id,
        books.title,
        books.author,
        books.price,
        books.image
      FROM wishlist
      JOIN books
      ON wishlist.book_id=books.id
      WHERE wishlist.user_id=?`,

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

// Remove Wishlist
exports.removeWishlist = async (req, res) => {

  try {

    await db.query(

      "DELETE FROM wishlist WHERE user_id=? AND book_id=?",

      [req.user.id, req.params.bookId]

    );

    res.json({
      message: "Removed"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
