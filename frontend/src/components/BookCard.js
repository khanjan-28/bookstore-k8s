
import React, { useState } from "react";
import api from "../services/api";

function BookCard({book, loadBooks, showToast}) {

const [showPopup, setShowPopup] = useState(false);
const [deleting, setDeleting] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [editImage, setEditImage] = useState(null);
const [editData, setEditData] = useState({
  title: book.title,
  author: book.author,
  category: book.category,
  price: book.price,
  description: book.description
});


const deleteBook = async () => {

try {

setDeleting(true);

await api.delete(`/books/${book.id}`);

loadBooks();

setShowPopup(false);

showToast(
"Book deleted successfully",
"success"
);


}
catch(err){

console.log(err);

showToast(
"Delete failed",
"error"
);

}
finally{

setDeleting(false);

}

};



const updateBook = async () => {

  try {

    const formData = new FormData();

    formData.append("title", editData.title);
    formData.append("author", editData.author);
    formData.append("category", editData.category);
    formData.append("price", editData.price);
    formData.append("description", editData.description);

    if (editImage) {
      formData.append("image", editImage);
    }

    await api.put(
      `/books/${book.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    loadBooks();

    setShowEdit(false);

    setEditImage(null);

    showToast(
      "Book updated successfully",
      "success"
    );

  } catch (err) {

    console.log(err);

    showToast(
      "Update failed",
      "error"
    );

  }

};


return (

<>


<tr>


<td>
<strong>#{book.id}</strong>
</td>


<td>
  <div className="bookInfo">

    {book.image ? (
      <img
        src={`/uploads/${book.image}`}
        alt={book.title}
        className="bookCover"
      />
    ) : (
      <div className="bookCoverPlaceholder">
        📚
      </div>
    )}

    <span>{book.title}</span>

  </div>
</td>

<td>
👤 {book.author}
</td>


<td>

<span className="categoryBadge">
{book.category}
</span>

</td>


<td>

<span className="priceBadge">
₹ {book.price}
</span>

</td>


<td>
{book.description}
</td>



<td>


<button
className="edit-btn"
onClick={()=>{
 setShowEdit(true);
 setShowPopup(false);
}}
>
✏️ Edit
</button>


<button
className="delete-btn"
onClick={()=>{
 setShowPopup(true);
 setShowEdit(false);
}}
>
🗑 Delete
</button>

</td>


</tr>





{/* DELETE POPUP OUTSIDE TABLE */}


{showPopup && (

<div
className="popupOverlay"
onClick={()=>setShowPopup(false)}
>


<div
className="popup"
onClick={(e)=>e.stopPropagation()}
>


<button
className="closePopup"
onClick={()=>setShowPopup(false)}
>
✕
</button>



<div className="popupIcon">
🗑️
</div>


<h2>
Delete Book
</h2>


<p>

Are you sure you want to delete

<br/>

<b>{book.title}</b>

?

</p>



<div className="popupButtons">


<button
className="confirmBtn"
onClick={deleteBook}
disabled={deleting}
>
{
deleting
?
"Deleting..."
:
"Delete"
}
</button>


<button
className="cancelBtn"
onClick={()=>setShowPopup(false)}
>
Cancel
</button>

</div>



</div>


</div>

)}







{/* EDIT POPUP OUTSIDE TABLE */}



{showEdit && (

<div
className="popupOverlay"
onClick={()=>setShowEdit(false)}
>


<div
className="popup"
onClick={(e)=>e.stopPropagation()}
>


<button
className="closePopup"
onClick={()=>setShowEdit(false)}
>
✕
</button>



<h2>
Edit Book
</h2>



<input
type="text"
value={editData.title}
onChange={(e)=>
setEditData({
...editData,
title:e.target.value
})
}
placeholder="Title"
/>




<input
type="text"
value={editData.author}
onChange={(e)=>
setEditData({
...editData,
author:e.target.value
})
}
placeholder="Author"
/>




<input
type="text"
value={editData.category}
onChange={(e)=>
setEditData({
...editData,
category:e.target.value
})
}
placeholder="Category"
/>




<input
type="number"
value={editData.price}
onChange={(e)=>
setEditData({
...editData,
price:e.target.value
})
}
placeholder="Price"
/>




<textarea

value={editData.description}

onChange={(e)=>
setEditData({
...editData,
description:e.target.value
})
}

placeholder="Description"

/>
{book.image && (
  <div style={{ marginTop: "15px", marginBottom: "10px" }}>
    <p><strong>Current Image</strong></p>

    <img
      src={`/uploads/${book.image}`}
      alt={book.title}
      style={{
        width: "90px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid #ddd"
      }}
    />
  </div>
)}

<input
  type="file"
  accept="image/png,image/jpeg,image/jpg,image/webp"
  onChange={(e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

      showToast(
        "Only JPG, PNG and WEBP images are allowed.",
        "error"
      );

      e.target.value = "";
      setEditImage(null);

      return;
    }

    if (file.size > 2 * 1024 * 1024) {

      showToast(
        "Image size must be less than 2 MB.",
        "error"
      );

      e.target.value = "";
      setEditImage(null);

      return;
    }

    setEditImage(file);

  }}
/>


<div className="popupButtons">


<button
className="confirmBtn"
onClick={updateBook}
>
Update
</button>


<button
className="cancelBtn"
onClick={()=>setShowEdit(false)}
>
Cancel
</button>


</div>



</div>


</div>


)}



</>

);


}


export default BookCard;
