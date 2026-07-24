import { useEffect, useState } from "react";
import api from "../services/api";

function OrdersList() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders-page">
      <h2>📦 Orders Management</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_name}</td>
              <td>₹{order.total_price}</td>
              <td>{order.payment_method}</td>

              <td>
                <select
                  defaultValue={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option>Placed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </td>

              <td>
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
