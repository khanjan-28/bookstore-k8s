import { useEffect, useState } from "react";
import api from "../../services/api";
import BookCard from "./BookCard";


function FeaturedBooks(){

const [books,setBooks] = useState([]);
const [search, setSearch] = useState("");

useEffect(()=>{

loadBooks();

},[]);



const loadBooks = async()=>{

try{

const response = await api.get("/books?limit=4");

setBooks(response.data.books || []);

}

catch(error){

console.log(error);

}

};



return(

<section className="featured">

<h2>
Featured Books 📚
</h2>
<input
  type="text"
  className="search-box"
  placeholder="Search books..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<div className="book-grid">


{
books
  .filter((book) => {
    const keyword = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      book.category.toLowerCase().includes(keyword)
    );
  })
  .map((book) => (

    <BookCard
      key={book.id}
      book={book}
    />

  ))
}

</div>


</section>

);


}


export default FeaturedBooks;
