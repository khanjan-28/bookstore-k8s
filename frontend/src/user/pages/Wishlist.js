import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../components/Navbar";
import Loader from "../../components/Loader";
function Wishlist() {

  const [wishlist, setWishlist] = useState([]);
const [loading, setLoading] = useState(true);  
const navigate = useNavigate();
  const loadWishlist = async () => {

try {

  setLoading(true);

  const res = await api.get("/wishlist");

  setWishlist(res.data);

}
catch(err){

  console.log(err);

}
finally{

  setLoading(false);

}
  };

  const removeWishlist = async (bookId) => {

    try {

      await api.delete(`/wishlist/${bookId}`);

      loadWishlist();

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadWishlist();

  }, []);

if (loading) {
  return <Loader />;
}
  return (

    <>

      <Navbar />

      <div className="booksContainer">

        <h1>❤️ My Wishlist</h1>

        {
wishlist.length === 0 ?

<div className="empty-state">

  <h2>
    ❤️ Your wishlist is empty
  </h2>

  <p>
    Save your favorite books to see them here.
  </p>

  <button onClick={() => navigate("/")}>
    Browse Books
  </button>

</div>
          :

          wishlist.map((book) => (

            <div
              className="bookCard"
              key={book.book_id}
            >

              <img
                src={`/uploads/${book.image}`}
                alt={book.title}
                width="150"
              />

              <h2>{book.title}</h2>

              <p>
                Author: {book.author}
              </p>

              <h3>
                ₹{book.price}
              </h3>

              <button
                onClick={() =>
                  removeWishlist(book.book_id)
                }
              >
                ❌ Remove
              </button>

            </div>

          ))

        }

      </div>

    </>

  );

}

export default Wishlist;
