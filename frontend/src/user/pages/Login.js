import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../User.css";


function Login(){

const navigate = useNavigate();


const [form,setForm] = useState({

email:"",
password:""

});


const [message,setMessage] = useState("");



const handleChange = (e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};



const handleLogin = async(e)=>{

e.preventDefault();


try{


const response = await api.post(
"/users/login",
form
);



localStorage.setItem(
"token",
response.data.token
);



localStorage.setItem(
"user",
JSON.stringify(response.data.user)
);



alert("Login Successful ✅");

navigate("/");

window.location.reload();

}
catch(error){


console.log(error);


setMessage(
error.response?.data?.message ||
"Login Failed"
);


}



};




return (

<div className="auth-container">


<form
className="auth-box"
onSubmit={handleLogin}
>


<h2>
Login
</h2>



<input

type="email"

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

/>



<input

type="password"

name="password"

placeholder="Password"

value={form.password}

onChange={handleChange}

/>



<button type="submit">

Login

</button>


<p>
{message}
</p>
<p>
Don't have an account?

<span
className="auth-link"
onClick={()=>navigate("/register")}
>
Create Account
</span>
</p>

</form>


</div>

);


}


export default Login;
