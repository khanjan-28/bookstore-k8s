import { useState } from "react";
import api from "../services/api";

function BookForm({ loadBooks }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !book.title ||
      !book.author ||
      !book.category ||
      !book.price
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await api.post("/books", book);

      alert("✅ Book added successfully!");

      setBook({
        title: "",
        author: "",
        category: "",
        price: "",
        description: "",
      });

      loadBooks();

    } catch (error) {
      console.error(error);
      alert("❌ Failed to add book.");
    }
  };

  return (
    <div className="book-form">

      <div className="form-header">
        <h2>📚 Add New Book</h2>
        <p>Add a new book to your online bookstore.</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label>📖 Book Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter Book Title"
            value={book.title}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>👤 Author</label>

          <input
            type="text"
            name="author"
            placeholder="Enter Author Name"
            value={book.author}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>📂 Category</label>

          <input
            type="text"
            name="category"
            placeholder="Programming / DevOps / Cloud..."
            value={book.category}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>💰 Price</label>

          <input
            type="number"
            name="price"
            placeholder="Enter Price"
            value={book.price}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>📝 Description</label>

          <textarea
            rows="4"
            name="description"
            placeholder="Write short description..."
            value={book.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="addBookBtn">
          ➕ Add Book
        </button>

      </form>

    </div>
  );
}

export default BookForm;
