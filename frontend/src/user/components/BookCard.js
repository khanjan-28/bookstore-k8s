import { useNavigate } from "react-router-dom";
import api from "../../services/api";
function BookCard({ book }) {

  const navigate = useNavigate();
const addToCart = async () => {

  try {

    await api.post("/cart", {
      bookId: book.id,
      quantity: 1
    });

    alert("🛒 Added to Cart");

  } catch (err) {

    console.log(err);

    alert("Failed to add cart");

  }

};

const addToWishlist = async () => {

  try {

    await api.post("/wishlist", {
      bookId: book.id
    });

    alert("❤️ Added to Wishlist");

  } catch (err) {

    console.log(err);

    alert("Failed");

  }

};
  return (

    <div className="book-card">

      <img
        src={`http://13.53.200.92:5000/uploads/${book.image}`}
        alt={book.title}
        className="book-image"
      />

      <h3>{book.title}</h3>

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Category:</strong> {book.category}
      </p>

      <p className="price">
        ₹ {book.price}
      </p>

<div className="book-actions">

  <button
    className="details-btn"
    onClick={() => navigate(`/book/${book.id}`)}
  >
    👁 View Details
  </button>

  <button
    className="cart-btn"
    onClick={addToCart}
  >
    🛒 Add To Cart
  </button>

  <button
    className="wishlist-btn"
    onClick={addToWishlist}
  >
    ❤️ Wishlist
  </button>

</div>
    </div>

  );

}

export default BookCard;
