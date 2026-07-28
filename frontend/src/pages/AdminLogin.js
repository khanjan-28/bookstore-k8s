import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin(){

const navigate = useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [error,setError]=useState("");
const [loading,setLoading]=useState(false);



const loginAdmin = async(e)=>{

e.preventDefault();

try{

setLoading(true);
setError("");


const res = await api.post(
"/admin/login",
{
email,
password
}
);


// Save admin token

localStorage.setItem(
"adminToken",
res.data.token
);


// Dashboard open

navigate("/admin");


}
catch(err){

console.log(err);

setError(
err.response?.data?.message || "Login Failed"
);

}
finally{

setLoading(false);

}

};



return (

<div className="admin-login">


<div className="admin-login-box">


<h1>
🔐 Admin Login
</h1>


{error &&

<p className="errorBox">
❌ {error}
</p>

}



<form onSubmit={loginAdmin}>


<input

type="email"

placeholder="Admin Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>



<button

type="submit"

disabled={loading}

>

{
loading
?
"Logging in..."
:
"Login"
}

</button>


</form>


</div>


</div>

);


}


export default AdminLogin;
