
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
const [showPaymentPopup,setShowPaymentPopup] = useState(false);

  const handleChange = (e)=>{

    setAddress({

      ...address,

      [e.target.name]:e.target.value

    });

  };


const placeOrder = async()=>{


  if(payment === "ONLINE"){

    setShowPaymentPopup(true);

    return;

  }


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

const paymentSuccess = async()=>{

  try{

    const response = await api.post("/orders/place",{

      ...address,
      payment:"ONLINE"

    });


    setShowPaymentPopup(false);

alert("Payment Successful");
    navigate(
      `/order-success/${response.data.orderId}`
    );


  }
catch(err){

  console.log(err.response?.data || err);

  alert(
    err.response?.data?.message ||
    "Payment Failed"
  );

}
};



const paymentFailed = ()=>{

  setShowPaymentPopup(false);

  alert("Payment Cancelled");

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
{
showPaymentPopup && (

  <div className="paymentPopup">

    <div className="paymentCard">

      <h2>
        💳 Demo Payment Gateway
      </h2>

      <p>
        Demo payment only. No real money deducted.
      </p>


      <button onClick={paymentSuccess}>
✅ Confirm Payment
      </button>


      <button onClick={paymentFailed}>
  ❌ Cancel Payment
</button>


    </div>

  </div>

)
}

    </div>
  );

}



export default Checkout;
