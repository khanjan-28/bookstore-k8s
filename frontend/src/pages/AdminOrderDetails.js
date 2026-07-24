import {useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import api from "../services/api";


function AdminOrderDetails(){

const {id}=useParams();

const [order,setOrder]=useState(null);
const [items,setItems]=useState([]);

useEffect(()=>{

loadOrder();

},[]);



const loadOrder=async()=>{

try{

const res=await api.get(
`/admin/orders/${id}`
);

setOrder(res.data.order);
setItems(res.data.items);
}
catch(err){

console.log(err);

}

};


if(!order){

return <h2>Loading...</h2>;

}


return(

<div className="admin-order-details">

<h1>
📦 Admin Order Details
</h1>

<h2>
Order #{order.id}
</h2>


<div className={`status-badge ${order.status.toLowerCase()}`}>
    {order.status}
</div>
<div className="order-timeline">

<div className="step active">
    📦
    <span>Placed</span>
</div>


<div className={
order.status === "Shipped" || order.status === "Delivered"
?
"step active"
:
"step"
}>
    🚚
    <span>Shipped</span>
</div>


<div className={
order.status === "Delivered"
?
"step active"
:
"step"
}>
    ✅
    <span>Delivered</span>
</div>

</div>

<p>
Customer:
{order.user_name}
</p>


<p>
Total:
₹{order.total_price}
</p>
<div className="order-info-card">

<h2>🏠 Shipping Address</h2>

<p>
Name: {order.full_name}
</p>

<p>
Phone: {order.phone}
</p>

<p>
Address: {order.address}
</p>

<p>
City: {order.city}
</p>

<p>
State: {order.state}
</p>

<p>
Pincode: {order.pincode}
</p>

</div>


<div className="order-info-card">

<h2>💳 Payment Details</h2>

<p>
Method: {order.payment_method}
</p>

</div>


<div className="order-info-card">

<h2>📅 Order Date</h2>

<p>
{new Date(order.created_at).toLocaleString()}
</p>

</div>
<h2>
📚 Items
</h2>


{
items.map((item,index)=>(

<div key={index}>

<div className="order-item-card">

<h3>
📖 {item.title}
</h3>

<p>
✍️ Author: {item.author}
</p>

<p>
📦 Quantity: {item.quantity}
</p>

<p>
💰 Price: ₹{item.price}
</p>

</div>
</div>

))
}
</div>

);


}


export default AdminOrderDetails;
