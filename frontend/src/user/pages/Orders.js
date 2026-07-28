import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
function Orders() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {

    try {

      const response = await api.get("/orders");

      setOrders(response.data);

    } catch (err) {

      console.log(err);

    }

  };
const downloadInvoice = async (id) => {

  try {

    const response = await api.get(
      `/orders/${id}/invoice`,
      {
        responseType: "blob"
      }
    );


    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );


    const link = document.createElement("a");

    link.href = url;

    link.download = `invoice-${id}.pdf`;

    document.body.appendChild(link);

    link.click();


    link.remove();

  }
  catch(err){

    console.log(err);

  }

};

  return (

    <>

      <Navbar />

      <div className="container">

        <h1>📦 My Orders</h1>

        {

          orders.length === 0 ?

          (

<div className="empty-state">

  <h2>
    📦 No orders yet
  </h2>

  <p>
    You haven't placed any orders yet.
  </p>

  <button onClick={() => navigate("/")}>
    Browse Books
  </button>

</div>
          )

          :

          (

            orders.map((order) => (

              <div
                className="bookCard"
                key={order.id}
              >

                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Total :
                  ₹{order.total_price}
                </p>

<p>
  Status :
  <span
    className={`status ${order.status.toLowerCase()}`}
  >
    {order.status}
  </span>
</p>
<div className="mini-timeline">

  <span
    className={
      order.status === "Placed" ||
      order.status === "Processing" ||
      order.status === "Shipped" ||
      order.status === "Delivered"
        ? "active"
        : ""
    }
  >
    📦
  </span>

  ────

  <span
    className={
      order.status === "Processing" ||
      order.status === "Shipped" ||
      order.status === "Delivered"
        ? "active"
        : ""
    }
  >
    ⚙️
  </span>

  ────

  <span
    className={
      order.status === "Shipped" ||
      order.status === "Delivered"
        ? "active"
        : ""
    }
  >
    🚚
  </span>

  ────

  <span
    className={
      order.status === "Delivered"
        ? "active"
        : ""
    }
  >
    ✅
  </span>

</div>
                <p>
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
                <button
  className="invoice-btn"
  onClick={() => downloadInvoice(order.id)}
>
  Download Invoice 📄
</button>
<button
  className="track-btn"
  onClick={() => navigate(`/order/${order.id}`)}
>
  🚚 Track Order
</button>
              </div>

            ))

          )

        }

      </div>

    </>

  );

}

export default Orders;
