import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import { useState } from "react";
import Auth from "./user/pages/Auth";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute from "./user/components/ProtectedRoute";
import ChangePassword from "./user/pages/ChangePassword";
import App from "./App";
import Profile from "./user/pages/Profile";
import Home from "./user/pages/Home";
import Register from "./user/pages/Register";
import Login from "./user/pages/Login";
import BookDetails from "./user/pages/BookDetails";
import Books from "./user/pages/Books";
import Orders from "./user/pages/Orders";
import OrderDetails from "./user/pages/OrderDetails";
import Cart from "./user/pages/Cart";
import Checkout from "./user/pages/Checkout";
import Wishlist from "./user/pages/Wishlist";
import OrderSuccess from "./user/pages/OrderSuccess";
function MainApp(){
const [isLoggedIn,setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
return (

<BrowserRouter>

<Routes>


{/* Admin Panel */}

<Route
path="/admin/login"
element={<AdminLogin />}
/>


<Route
path="/admin"
element={<App />}
/>


<Route
path="/admin/order/:id"
element={<AdminOrderDetails />}
/>
{/* User Website */}

<Route
path="/"
element={
isLoggedIn
?
<Home />
:
<Login />
}
/>
{/* Authentication */}

<Route
path="/register"
element={<Register />}
/>


<Route
path="/login"
element={<Login />}
/>
<Route
path="/books"
element={<Books />}
/>
<Route
path="/book/:id"
element={<BookDetails />}
/>
<Route
path="/cart"
element={
<ProtectedRoute>
<Cart />
</ProtectedRoute>
}
/>
<Route
path="/checkout"
element={
<ProtectedRoute>
<Checkout />
</ProtectedRoute>
}
/>
<Route
path="/profile"
element={
<ProtectedRoute>
<Profile />
</ProtectedRoute>
}
/>
<Route
path="/orders"
element={
<ProtectedRoute>
<Orders />
</ProtectedRoute>
}
/>
<Route
path="/order/:id"
element={
<ProtectedRoute>
<OrderDetails />
</ProtectedRoute>
}
/>
<Route
path="/order-success/:id"
element={
  <ProtectedRoute>
    <OrderSuccess />
  </ProtectedRoute>
}
/>
<Route
path="/wishlist"
element={
<ProtectedRoute>
<Wishlist />
</ProtectedRoute>
}
/>
<Route
path="/change-password"
element={
<ProtectedRoute>
<ChangePassword />
</ProtectedRoute>
}
/>
</Routes>
</BrowserRouter>

);

}


export default MainApp;
