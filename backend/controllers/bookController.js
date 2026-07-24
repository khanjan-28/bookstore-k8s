const db = require("../config/db");

// Get all books
exports.getBooks = async (req,res)=>{

    try{

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;


        const offset = (page - 1) * limit;


let orderBy = "id ASC";


if(req.query.sort === "price_low"){

    orderBy = "price ASC";

}

else if(req.query.sort === "price_high"){

    orderBy = "price DESC";

}

else if(req.query.sort === "title_az"){

    orderBy = "title ASC";

}

else if(req.query.sort === "title_za"){

    orderBy = "title DESC";

}



const [books] = await db.query(

`SELECT * FROM books 
ORDER BY ${orderBy}
LIMIT ? OFFSET ?`,

[
 limit,
 offset
]

);

        const [count] = await db.query(

            "SELECT COUNT(*) as total FROM books"

        );


        res.json({

            books: books,

            totalBooks: count[0].total,

            currentPage: page,

            totalPages: Math.ceil(
                count[0].total / limit
            )

        });


    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

};
// Get one book
exports.getBook = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM books WHERE id=?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Book Not Found"
            });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({
            message: "Database Error"
        });
    }
};

// Add book

exports.addBook = async (req, res) => {

    const {
        title,
        author,
        price,
        category,
        description
    } = req.body;

    const image = req.file ? req.file.filename : null;
    console.log("req.file:", req.file);
console.log("req.body:", req.body);

    try {

        await db.query(
            `INSERT INTO books
            (title, author, price, category, description, image)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title,
                author,
                price,
                category,
                description,
                image
            ]
        );

        res.status(201).json({
            message: "Book Added"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};

// Update book

exports.updateBook = async (req, res) => {

    const {
        title,
        author,
        price,
        category,
        description
    } = req.body;

    try {

        if (req.file) {

            await db.query(
                `UPDATE books
                 SET title=?,
                     author=?,
                     price=?,
                     category=?,
                     description=?,
                     image=?
                 WHERE id=?`,
                [
                    title,
                    author,
                    price,
                    category,
                    description,
                    req.file.filename,
                    req.params.id
                ]
            );

        } else {

            await db.query(
                `UPDATE books
                 SET title=?,
                     author=?,
                     price=?,
                     category=?,
                     description=?
                 WHERE id=?`,
                [
                    title,
                    author,
                    price,
                    category,
                    description,
                    req.params.id
                ]
            );

        }

        res.json({
            message: "Book Updated"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};
// Delete book
exports.deleteBook = async (req, res) => {

    try {

        await db.query(
            "DELETE FROM books WHERE id=?",
            [req.params.id]
        );

        res.json({
            message: "Book Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: "Database Error"
        });

    }

};

// Search books
exports.searchBooks = async (req, res) => {

    const keyword = `%${req.query.keyword}%`;

    try {

        const [rows] = await db.query(
            `SELECT *
             FROM books
             WHERE title LIKE ?
                OR author LIKE ?
                OR category LIKE ?`,
            [keyword, keyword, keyword]
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            message: "Database Error"
        });

    }

};
// Dashboard Stats
exports.getDashboardStats = async (req, res) => {

  try {

    const [totalBooks] = await db.query(
      "SELECT COUNT(*) AS total FROM books"
    );

    const [categories] = await db.query(
      "SELECT COUNT(DISTINCT category) AS total FROM books"
    );

    const [averagePrice] = await db.query(
      "SELECT AVG(price) AS average FROM books"
    );

    const [latestBook] = await db.query(
      "SELECT title, author FROM books ORDER BY id DESC LIMIT 1"
    );

    res.json({
      totalBooks: totalBooks[0].total,
      totalCategories: categories[0].total,
      averagePrice: Math.round(averagePrice[0].average || 0),
      latestBook:
        latestBook.length > 0
          ? latestBook[0]
          : null
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error"
    });

  }

};
