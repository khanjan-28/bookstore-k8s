import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../User.css";


function Register(){

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




const handleRegister = async(e)=>{

e.preventDefault();


try{


const response = await api.post(
"/users/register",
form
);



alert("Registration Successful ✅");

navigate("/login");


}
catch(error){


console.log(error);


setMessage(
error.response?.data?.message || 
"Registration Failed"
);


}



};




return (

<div className="auth-container">


<form 
className="auth-box"
onSubmit={handleRegister}
>


<h2>
Create Account
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
Register
</button>


<p className="auth-message">
{message}
</p>

<p>
Already have an account?

<span
className="auth-link"
onClick={()=>navigate("/login")}
>
Login
</span>

</p>

</form>


</div>


);


}


export default Register;
