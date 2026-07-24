import { Link } from "react-router-dom";
import "../User.css";

function Auth(){

return(

<div className="auth-container">

<div className="auth-box">

<h2>
📚 BookStore
</h2>

<p>
Welcome to Online Book Store
</p>


<Link to="/login">
<button>
Login
</button>
</Link>


<br/><br/>


<Link to="/register">
<button>
Create Account
</button>
</Link>


</div>

</div>

);

}

export default Auth;
