import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../components/Navbar";
import "../User.css";


function OrderDetails(){

const {id}=useParams();

const [data,setData]=useState(null);


useEffect(()=>{

loadOrder();

},[]);



const loadOrder=async()=>{

try{

const response=await api.get(
`/orders/${id}`
);

setData(response.data);

}
catch(err){

console.log(err);

}

};


const downloadInvoice = async () => {

try{

const token = localStorage.getItem("token");


const response = await fetch(
`/api/orders/${id}/invoice`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


const blob = await response.blob();


const url = window.URL.createObjectURL(blob);


const link = document.createElement("a");

link.href=url;

link.download=`invoice-${id}.pdf`;

document.body.appendChild(link);

link.click();


link.remove();


}
catch(err){

console.log(err);

}

};
if(!data){

return <h2>Loading...</h2>;

}



return(

<>

<Navbar />


<div className="order-details-container">


<div className="order-header">

<h1>
📦 Order Details
</h1>


<h2>
Order #{data.order.id}
</h2>


<span className="order-status">

{data.order.status}

</span>


<p>
Order Total:
<b> ₹{data.order.total_price}</b>
</p>
<button
 className="invoice-btn"
 onClick={downloadInvoice}
>
📄 Download Invoice
</button>
</div>



<div className="order-section">

<h2>
📚 Items
</h2>


{
data.items.map((item,index)=>(


<div className="order-item" key={index}>


<h3>
{item.title}
</h3>


<div>

Quantity:
<b>{item.quantity}</b>

</div>


<div>

Price:
<b> ₹{item.price}</b>

</div>


</div>


))
}


</div>





<div className="order-section">

<h2>
🏠 Shipping Address
</h2>


<div className="address-card">

<p>Name: {data.order.full_name}</p>

<p>Phone: {data.order.phone}</p>

<p>{data.order.address}</p>

<p>
{data.order.city},
{data.order.state}
</p>

<p>
Pincode: {data.order.pincode}
</p>


</div>


</div>





<div className="order-section">

<h2>
💳 Payment
</h2>


<div className="payment-card">

{data.order.payment_method}

</div>


</div>



</div>


</>

);


}


export default OrderDetails;
