import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function OrdersList(){
const navigate = useNavigate();
const [orders,setOrders]=useState([]);
const [status,setStatus]=useState({});



useEffect(()=>{

loadOrders();

},[]);



const loadOrders=async()=>{

try{

const res=await api.get("/admin/orders");

setOrders(res.data);

}

catch(err){

console.log(err);

}

};



const updateStatus=async(id)=>{

try{

await api.put(
`/admin/orders/${id}`,
{
status:status[id]
}
);


loadOrders();


}

catch(err){

console.log(err);

}

};




return(

<div className="orders-page">


<h2>
📦 Orders Management
</h2>



<div className="admin-orders-grid">


{
orders.map(order=>(


<div 
className="admin-order-card"
key={order.id}
>


<h3>
Order #{order.id}
</h3>


<p>
Customer:
<b>{order.user_name}</b>
</p>


<p>
Total:
<b> ₹{order.total_price}</b>
</p>


<p>
Payment:
<b>{order.payment_method || "COD"}</b>
</p>
<p>
Date:
<b>{order.created_at}</b>
</p>
<p>
Status:

<span className={`status-badge ${(order.status || "Placed").toLowerCase()}`}>
{order.status || "Placed"}
</span>

</p>


<div className="status-box">


<select

value={
status[order.id] || order.status
}


onChange={(e)=>

setStatus({

...status,

[order.id]:e.target.value

})

}

>


<option>
Placed
</option>

<option>
Shipped
</option>

<option>
Delivered
</option>


</select>



<button

onClick={()=>updateStatus(order.id)}

>

Update Status

</button>
<button

onClick={()=>navigate(`/admin/order/${order.id}`)}

>
👁 View Details
</button>
</div>



</div>


))

}


</div>


</div>

);


}


export default OrdersList;
