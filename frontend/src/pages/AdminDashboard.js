import React, { useEffect, useState } from "react";
import "../App.css";

import api from "../services/api";

import DashboardCharts from "../components/DashboardCharts";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import BookForm from "../components/BookForm";
import OrdersList from "../components/OrdersList";

import { exportToPDF } from "../utils/export";


function AdminDashboard(){

const [books,setBooks]=useState([]);

const [stats,setStats]=useState({
totalBooks:0,
totalCategories:0,
averagePrice:0
});


const [loading,setLoading]=useState(false);

const [error,setError]=useState("");

const [searchKeyword,setSearchKeyword]=useState("");

const [categoryFilter,setCategoryFilter]=useState("All");

const [activeTab,setActiveTab]=useState("books");


const [darkMode,setDarkMode]=useState(false);


const [toast,setToast]=useState(null);


const [showAdd,setShowAdd]=useState(false);


const [adding,setAdding]=useState(false);


const [selectedImage,setSelectedImage]=useState(null);


const [currentPage,setCurrentPage]=useState(1);


const [totalPages,setTotalPages]=useState(1);


const [sort,setSort]=useState("default");



const [newBook,setNewBook]=useState({

title:"",
author:"",
category:"",
price:"",
description:""

});



const loadBooks=async()=>{

try{

setLoading(true);


const res=await api.get(
`/books?page=${currentPage}&limit=10&sort=${sort}`
);


setBooks(res.data.books || []);

setTotalPages(res.data.totalPages || 1);


}

catch(err){

console.log(err);

setError("Failed to load books");

}

finally{

setLoading(false);

}

};



const loadStats=async()=>{

try{

const res=await api.get(
"/books/stats/dashboard"
);


setStats(res.data);


}

catch(err){

console.log(err);

}

};



useEffect(()=>{

loadBooks();

loadStats();

},[currentPage,sort]);



const showToast=(message,type)=>{

setToast({
message,
type
});


setTimeout(()=>{

setToast(null);

},3000);


};



const categories=[

"All",

...new Set(
books.map(b=>b.category)
)

];



const filteredBooks=books.filter(book=>{


const search=searchKeyword.toLowerCase();


return (

(categoryFilter==="All" ||
book.category===categoryFilter)

&&

(
search==="" ||

book.title.toLowerCase().includes(search)

||
book.author.toLowerCase().includes(search)

)

);


});



const addBook=async()=>{

try{


setAdding(true);


const formData=new FormData();


Object.keys(newBook).forEach(key=>{

formData.append(
key,
newBook[key]
);

});


if(selectedImage){

formData.append(
"image",
selectedImage
);

}



await api.post(
"/books",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);



showToast(
"Book Added Successfully",
"success"
);



setShowAdd(false);


loadBooks();


}

catch(err){

console.log(err);

showToast(
"Failed",
"error"
);


}

finally{

setAdding(false);

}


};
return (

<div className={darkMode ? "app dark" : "app"}>


<nav className="navbar">

<div>

<h1>
📚 Online Book Store
</h1>

<span>
React • Node • Docker • Kubernetes
</span>

</div>


<button
className="themeToggle"
onClick={()=>setDarkMode(!darkMode)}
>

{darkMode ? "☀️" : "🌙"}

</button>


</nav>



<div className="adminTabs">


<button

className={
activeTab==="books"
?
"activeTab"
:
""
}

onClick={()=>setActiveTab("books")}

>

📚 Books

</button>



<button

className={
activeTab==="orders"
?
"activeTab"
:
""
}

onClick={()=>setActiveTab("orders")}

>

📦 Orders

</button>



</div>



<div className="container">



<div className="dashboard">


<div className="card">

<div className="icon">
📚
</div>

<h2>
{stats.totalBooks}
</h2>

<p>
Total Books
</p>

</div>



<div className="card">

<div className="icon">
📂
</div>

<h2>
{stats.totalCategories}
</h2>

<p>
Categories
</p>

</div>



<div className="card">

<div className="icon">
💰
</div>

<h2>
₹ {stats.averagePrice}
</h2>

<p>
Average Price
</p>

</div>



<div className="card">

<div className="icon">
🔍
</div>

<h2>
{filteredBooks.length}
</h2>

<p>
Search Results
</p>

</div>


</div>




{
activeTab==="books"
?

<>

<DashboardCharts
books={filteredBooks}
/>



<SearchBar

searchKeyword={searchKeyword}

setSearchKeyword={setSearchKeyword}

categoryFilter={categoryFilter}

setCategoryFilter={setCategoryFilter}

categories={categories}

/>



<div className="bookHeader">


<div className="sortBox">


<label>
🔽 Sort By
</label>


<select

value={sort}

onChange={(e)=>{

setSort(e.target.value);

setCurrentPage(1);

}}

>


<option value="default">
Default
</option>


<option value="price_low">
Price Low → High
</option>


<option value="price_high">
Price High → Low
</option>


<option value="title_az">
Title A → Z
</option>


<option value="title_za">
Title Z → A
</option>



</select>


</div>




<div className="headerButtons">


<button

className="exportBtn"

onClick={()=>exportToPDF(filteredBooks)}

>

📄 Export PDF

</button>



<button

className="addBookBtn"

onClick={()=>setShowAdd(true)}

>

➕ Add New Book

</button>



</div>


</div>





{
loading &&

<div className="loader">

Loading Books... ⏳

</div>

}




{
error &&

<div className="errorBox">

❌ {error}

<button
onClick={loadBooks}
>

Retry

</button>


</div>

}





<BookList
  books={filteredBooks}
  loadBooks={loadBooks}
  showToast={showToast}
  searchKeyword={searchKeyword}
/>

</>

:

<OrdersList />

}

{showAdd && (

<div
className="modalOverlay"
onClick={()=>setShowAdd(false)}
>


<div
className="bookModal"
onClick={(e)=>e.stopPropagation()}
>


<button

className="closeBtn"

onClick={()=>setShowAdd(false)}

>

✕

</button>



<h2>
➕ Add New Book
</h2>



<input

type="text"

placeholder="Book Title"

value={newBook.title}

onChange={(e)=>

setNewBook({

...newBook,

title:e.target.value

})

}

/>



<input

type="text"

placeholder="Author Name"

value={newBook.author}

onChange={(e)=>

setNewBook({

...newBook,

author:e.target.value

})

}

/>



<select

value={newBook.category}

onChange={(e)=>

setNewBook({

...newBook,

category:e.target.value

})

}

>


<option value="">
Select Category
</option>


<option value="Programming">
Programming
</option>


<option value="DevOps">
DevOps
</option>


<option value="Cloud">
Cloud
</option>


<option value="Database">
Database
</option>


<option value="Networking">
Networking
</option>


<option value="Security">
Security
</option>


<option value="AI">
AI
</option>


</select>




<input

type="number"

placeholder="Price"

value={newBook.price}

onChange={(e)=>

setNewBook({

...newBook,

price:e.target.value

})

}

/>



<textarea

placeholder="Description"

value={newBook.description}

onChange={(e)=>

setNewBook({

...newBook,

description:e.target.value

})

}

/>




<input

type="file"

accept="image/*"

onChange={(e)=>{

setSelectedImage(
e.target.files[0]
)

}}

/>




<div className="modalFooter">


<button

className="confirmBtn"

disabled={adding}

onClick={addBook}

>


{
adding
?
"Adding..."
:
"Add Book"
}


</button>




<button

className="cancelBtn"

onClick={()=>setShowAdd(false)}

>

Cancel

</button>


</div>


</div>


</div>

)}





<div className="pagination">


{

Array.from(

{length:totalPages},

(_,index)=>(


<button

key={index}

className={
currentPage===index+1
?
"activePage"
:
""
}


onClick={()=>setCurrentPage(index+1)}

>


{index+1}


</button>



)

)


}



<button

disabled={currentPage===totalPages}

onClick={()=>setCurrentPage(currentPage+1)}

>

Next

</button>



</div>



</div>



{toast && (
  <div className={`toast ${toast.type}`}>
    {toast.type==="success" ? "✅ " : "❌ "}
    {toast.message}
  </div>
)}



<footer>

© 2026 Online Book Store

<br/>

Developed with ❤️ using

React • Node • Docker • Kubernetes


</footer>



</div>


);


}



export default AdminDashboard;
