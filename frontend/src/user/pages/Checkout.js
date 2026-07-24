import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Checkout() {

  const navigate = useNavigate();

  const [address, setAddress] = useState({

    fullName:"",
    phone:"",
    address:"",
    city:"",
    state:"",
    pincode:""

  });


  const [payment,setPayment] = useState("COD");


  const handleChange = (e)=>{

    setAddress({

      ...address,

      [e.target.name]:e.target.value

    });

  };


  const placeOrder = async()=>{

    try{


const response = await api.post("/orders/place",{

  ...address,
  payment

});


navigate(
  `/order-success/${response.data.orderId}`
);

    }
    catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to place order"
      );

    }

  };


  return (

    <div className="checkoutPage">


      <h1>🧾 Checkout</h1>


      <div className="checkoutBox">


        <h2>🏠 Shipping Address</h2>


        <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        />


        <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        />


        <textarea
        name="address"
        placeholder="Full Address"
        onChange={handleChange}
        />


        <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        />


        <input
        name="state"
        placeholder="State"
        onChange={handleChange}
        />


        <input
        name="pincode"
        placeholder="Pincode"
        onChange={handleChange}
        />



        <h2>💳 Payment Method</h2>


        <label>

        <input
        type="radio"
        value="COD"
        checked={payment==="COD"}
        onChange={(e)=>setPayment(e.target.value)}
        />

        Cash On Delivery

        </label>



        <br/>


        <label>

        <input
        type="radio"
        value="ONLINE"
        checked={payment==="ONLINE"}
        onChange={(e)=>setPayment(e.target.value)}
        />

        Online Payment (UI Only)

        </label>



        <br/><br/>


        <button
        onClick={placeOrder}
        >

        ✅ Place Order

        </button>


      </div>


    </div>

  );

}


export default Checkout;
