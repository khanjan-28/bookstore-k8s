import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


function Cart(){

const [cart,setCart] = useState([]);

const navigate = useNavigate();



useEffect(()=>{

loadCart();

},[]);



const loadCart = async()=>{

try{

const response = await api.get("/cart");

setCart(response.data);


}
catch(err){

console.log(err);

}

};

const increaseQty = async(id)=>{

try{

await api.put(`/cart/increase/${id}`);

loadCart();

}
catch(err){

console.log(err);

}

};


const decreaseQty = async(id)=>{

try{

await api.put(`/cart/decrease/${id}`);

loadCart();

}
catch(err){

console.log(err);

}

};




const removeItem = async(id)=>{

try{

await api.delete(`/cart/${id}`);

loadCart();

}
catch(err){

console.log(err);

}

};



const total = cart.reduce(

(sum,item)=>

sum + Number(item.price) * item.quantity

,0);



return(

<div className="cart-page">


<h1>
My Cart 🛒
</h1>



{
cart.length===0 ?


<div className="empty-state">

<h2>
🛒 Your cart is empty
</h2>

<p>
Add some books and start shopping!
</p>

<button onClick={()=>navigate("/")}>
Browse Books
</button>

</div>

:


<>


<div className="cart-container">


{
cart.map((item)=>(


<div className="cart-card" key={item.id}>


<img

src={`http://13.53.200.92:5000/uploads/${item.image}`}

alt={item.title}

/>



<div>


<h2>
{item.title}
</h2>


<p>
Author: {item.author}
</p>


<p>
Price: ₹{item.price}
</p>



<div>


<button
onClick={()=>decreaseQty(item.id)}
>
-
</button>


<span>
{item.quantity}
</span>


<button
onClick={()=>increaseQty(item.id)}
>
+
</button>


</div>



<button

onClick={()=>removeItem(item.id)}

>
Remove
</button>



</div>


</div>


))

}


</div>



<h2>
Total: ₹{total}
</h2>



<button
onClick={()=>navigate("/checkout")}
>
Checkout
</button>


</>


}



</div>


);


}


export default Cart;
