import { useEffect, useState } from "react";
import api from "../../services/api";
import "../User.css";
import Navbar from "../components/Navbar";

function Profile(){

const [user,setUser] = useState(null);
const [loading,setLoading] = useState(true);



useEffect(()=>{

loadProfile();

},[]);



const loadProfile = async()=>{

try{

const response = await api.get(
"/users/profile"
);


setUser(response.data);


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};



if(loading){

return <h2>Loading...</h2>;

}



return (

<div>

<Navbar />

<div className="auth-container">
<div className="auth-box">

<h2>
My Profile
</h2>


{
user &&

<>

<p>
Name : {user.name}
</p>


<p>
Email : {user.email}
</p>


<p>
Phone : {user.phone || "Not Added"}
</p>


<p>
Role : {user.role}
</p>


</>

}


</div>

</div>


</div>

);


}


export default Profile;
