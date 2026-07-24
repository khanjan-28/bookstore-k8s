import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderSuccess() {

  const navigate = useNavigate();

  const { id } = useParams();


  return (

    <>

      <Navbar />


      <div className="empty-state">


        <h2>
          🎉 Order Confirmed!
        </h2>


        <p>
          Thank you for your purchase.
        </p>


        <h3>
          Order ID: #{id}
        </h3>


        <p>
          Your order has been placed successfully.
        </p>



        <button
          onClick={() => navigate("/orders")}
        >
          📦 View My Orders
        </button>



        <button
          onClick={() => navigate("/")}
        >
          🛒 Continue Shopping
        </button>


      </div>


    </>

  );

}


export default OrderSuccess;
