import {useEffect,useState} from "react";
import api from "../../services/api";
import BookCard from "../components/BookCard";
import Loader from "../../components/Loader";
import "../User.css";


function Books(){

const [books,setBooks]=useState([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const [category,setCategory]=useState("");


useEffect(()=>{

loadBooks();

},[]);



const loadBooks = async()=>{

try{

setLoading(true);


const res = await api.get("/books");

setBooks(
  Array.isArray(res.data)
  ?
  res.data
  :
  res.data.books
);

}
catch(err){

console.log(err);

}
finally{

setLoading(false);

}

};

const categories=[
"Programming",
"Fiction",
"Technology",
"Database",
"Cloud"
];



const filteredBooks=books.filter((book)=>{


return (

book.title
.toLowerCase()
.includes(search.toLowerCase())

&&

(category===""
||
book.category===category)

);


});
if(loading){

return <Loader/>;

}


return (

<div className="books-page">


<h1>
All Books
</h1>


<div className="book-filter">


<input

placeholder="Search book..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>



<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

>

<option value="">
All Category
</option>


{
categories.map((cat)=>(

<option key={cat}>
{cat}
</option>

))
}


</select>


</div>



<div className="book-grid">


{

filteredBooks.map((book)=>(


<BookCard

key={book._id}

book={book}

/>


))


}


</div>


</div>

);


}


export default Books;
