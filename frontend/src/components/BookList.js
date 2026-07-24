import React from "react";
import BookCard from "./BookCard";

function BookList({ books, loadBooks, showToast, searchKeyword }) {
  return (

    <div className="book-list">


      <div className="tableHeader">

        <h2>
          📚 Available Books
        </h2>

        <span>
          Total: {books.length}
        </span>

      </div>



{books.length === 0 ? (

  <div className="noBooks">

    <div className="emptyIcon">

      {
        searchKeyword
        ?
        "🔍"
        :
        "📚"
      }

    </div>


    <h3>

      {
        searchKeyword
        ?
        `No books match "${searchKeyword}"`
        :
        "No Books Available"
      }

    </h3>


    <p>

      {
        searchKeyword
        ?
        "Try another keyword"
        :
        "Add your first book to get started"
      }

    </p>


  </div>


) : (

        <div className="tableContainer">

          <table>


            <thead>

              <tr>

                <th>ID</th>

                <th>Book</th>

                <th>Author</th>

                <th>Category</th>

                <th>Price</th>

                <th>Description</th>

                <th>Action</th>

              </tr>

            </thead>



            <tbody>


              {

                books.map((book)=>(

                  <BookCard

                    key={book.id}

                    book={book}

                    loadBooks={loadBooks}

                    showToast={showToast}

                  />

                ))

              }


            </tbody>


          </table>


        </div>


      )}


    </div>

  );

}


export default BookList;
