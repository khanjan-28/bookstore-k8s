const db = require("../config/db");

// Add Review
exports.addReview = async (req, res) => {

  try {

    const { rating, review } = req.body;

    const bookId = req.params.bookId;

    const userId = req.user.id;

    await db.query(

      `INSERT INTO reviews
      (user_id, book_id, rating, review)
      VALUES (?, ?, ?, ?)`,

      [
        userId,
        bookId,
        rating,
        review
      ]

    );

    res.json({
      message: "Review added successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};


// Get Reviews
exports.getReviews = async (req, res) => {

  try {

    const [reviews] = await db.query(

      `SELECT
        reviews.*,
        users.name
      FROM reviews
      JOIN users
      ON reviews.user_id = users.id
      WHERE reviews.book_id=?
      ORDER BY reviews.id DESC`,

      [req.params.bookId]

    );

    res.json(reviews);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
