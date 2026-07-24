import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


function Navbar() {


const navigate = useNavigate();


const [loggedIn,setLoggedIn] = useState(
  !!localStorage.getItem("token")
);



const logout = ()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

setLoggedIn(false);

navigate("/login");

};



return (

<nav className="user-navbar">


<div className="logo">

📚 BookStore

</div>



<ul className="nav-links">


<li>
<Link to="/">Home</Link>
</li>


<li>
<Link to="/books">Books</Link>
</li>
<li>
<Link to="/wishlist">
❤️ Wishlist
</Link>
</li>


{
loggedIn ?


<>


<li>
<Link to="/profile">
Profile
</Link>
</li>
<li>
<Link to="/orders">
My Orders
</Link>
</li>

<li>
<button
onClick={logout}
>
Logout
</button>
</li>


</>


:


<>

<li>
<Link to="/login">
Login
</Link>
</li>


<li>
<Link to="/register">
Register
</Link>
</li>


</>


}



<li>
<Link to="/cart">
Cart
</Link>
</li>



</ul>


</nav>

);


}


export default Navbar;
