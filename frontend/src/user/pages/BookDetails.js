import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "../User.css";

function BookDetails() {

  const { id } = useParams();

  const [book, setBook] = useState(null);
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [review, setReview] = useState("");
useEffect(() => {
  loadBook();
  loadReviews();
}, []);
  const loadBook = async () => {

    try {

      const response = await api.get(`/books/${id}`);

      setBook(response.data);

    } catch (err) {

      console.log(err);

    }

  };
const loadReviews = async () => {

  try {

    const response = await api.get(`/reviews/${id}`);

    setReviews(response.data);

  } catch (err) {

    console.log(err);

  }

};
const submitReview = async () => {

  try {

    await api.post(`/reviews/${id}`, {
      rating,
      review
    });

    setRating(5);
    setReview("");

    loadReviews();

    alert("Review Added ⭐");

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to add review"
    );

  }

};
const handleAddToCart = async () => {

  try {

    await api.post("/cart", {
      book_id: book.id
    });

    alert("Book added to cart ✅");

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to add book to cart"
    );

  }

};
const handleAddToWishlist = async () => {

  try {

    await api.post("/wishlist", {
      bookId: book.id
    });

    alert("Added to Wishlist ❤️");

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to add wishlist"
    );

  }

};

  if (!book) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="book-details">

      <img
        src={`http://13.53.200.92:5000/uploads/${book.image}`}
        alt={book.title}
        className="details-image"
      />

      <div className="details-content">

        <h1>{book.title}</h1>

        <p>
          <strong>Author:</strong> {book.author}
        </p>

        <p>
          <strong>Category:</strong> {book.category}
        </p>

        <p>
          <strong>Price:</strong> ₹ {book.price}
        </p>

        <p>
          <strong>Description:</strong>
        </p>

        <p>{book.description}</p>

<button
  className="details-btn"
  onClick={handleAddToCart}
>
  Add To Cart
</button>
<button
  className="details-btn wishlist-btn"
  onClick={handleAddToWishlist}
>
  ❤️ Add To Wishlist
</button>
<hr />

<hr />

<div className="review-section">

<h2>⭐ Customer Reviews</h2>


<div className="rating-summary">

<div className="average-rating">
4.8 / 5
</div>

<div className="star-rating">
★★★★★
</div>

<div className="total-reviews">
Based on {reviews.length} Reviews
</div>

</div>



<div className="review-form">


<select
value={rating}
onChange={(e)=>setRating(e.target.value)}
>

<option value="5">
⭐⭐⭐⭐⭐
</option>

<option value="4">
⭐⭐⭐⭐
</option>

<option value="3">
⭐⭐⭐
</option>

<option value="2">
⭐⭐
</option>

<option value="1">
⭐
</option>

</select>



<textarea

placeholder="Share your experience..."

value={review}

onChange={(e)=>setReview(e.target.value)}

/>



<button

className="review-submit-btn"

onClick={submitReview}

>

Submit Review

</button>


</div>




<div className="review-list">


{
reviews.map((item)=>(


<div
className="review-card"
key={item.id}
>


<div className="review-header">


<div className="review-avatar">

{
item.name
?
item.name.charAt(0).toUpperCase()
:
"U"
}

</div>



<div>

<div className="review-user">

{item.name}

</div>


<div className="review-date">

📅 Customer Review

</div>


</div>


</div>



<div className="review-stars">

{"⭐".repeat(item.rating)}

</div>



<p className="review-text">

{item.review}

</p>


</div>


))
}

  </div>


  </div>


  </div>


 </div>


  );
}

export default BookDetails;
