import { useState } from "react";
import api from "../../services/api";
import "../User.css";
import Navbar from "../components/Navbar";


function ChangePassword(){

const [form,setForm] = useState({
    currentPassword:"",
    newPassword:"",
    confirmPassword:""
});


const [message,setMessage] = useState("");


const changePassword = async()=>{


if(
!form.currentPassword ||
!form.newPassword ||
!form.confirmPassword
){

setMessage("Please fill all fields");
return;

}


if(form.newPassword !== form.confirmPassword){

setMessage("New password does not match");
return;

}


try{


const response = await api.put(
"/users/change-password",
{
currentPassword:form.currentPassword,
newPassword:form.newPassword
}
);


setMessage(response.data.message);


setForm({
currentPassword:"",
newPassword:"",
confirmPassword:""
});


}
catch(error){

console.log(error);

setMessage(
error.response?.data?.message || "Failed"
);

}


};


return(

<div>

<Navbar />


<div className="auth-container">

<div className="auth-box">


<h2>
Change Password
</h2>


<input
type="password"
placeholder="Current Password"
value={form.currentPassword}
onChange={(e)=>
setForm({
...form,
currentPassword:e.target.value
})
}
/>


<input
type="password"
placeholder="New Password"
value={form.newPassword}
onChange={(e)=>
setForm({
...form,
newPassword:e.target.value
})
}
/>


<input
type="password"
placeholder="Confirm New Password"
value={form.confirmPassword}
onChange={(e)=>
setForm({
...form,
confirmPassword:e.target.value
})
}
/>


<button
onClick={changePassword}
>
Change Password
</button>


<p>
{message}
</p>


</div>

</div>


</div>

);


}


export default ChangePassword;
