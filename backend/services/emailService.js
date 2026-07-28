const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({

host: process.env.EMAIL_HOST,

port: Number(process.env.EMAIL_PORT),

secure:false,

auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS,
}

});



const sendEmail = async ({to,subject,html})=>{

await transporter.sendMail({

from:process.env.EMAIL_FROM,

to,

subject,

html

});

};



// Refund Email

const sendRefundEmail = async(data)=>{


const html = `

<h2>Bookstore Refund Update</h2>

<p>Hello ${data.name},</p>


<p>Your order <b>#${data.orderId}</b> has been cancelled.</p>


<h3>Refund Details</h3>

<p>
Refund ID: ${data.refundId}
</p>

<p>
Refund Amount: ₹${data.amount}
</p>

<p>
Refund Date: ${new Date().toLocaleString()}
</p>

<p>
Payment Status: <b>Refunded</b>
</p>


<p>
Thank you,<br>
Bookstore Team
</p>

`;



await sendEmail({

to:data.email,

subject:`Refund Initiated - Order #${data.orderId}`,

html

});


};



const sendOrderStatusEmail = async(data)=>{


const html = `

<h2>Bookstore Order Update</h2>

<p>Hello ${data.name},</p>

<p>
Your order <b>#${data.orderId}</b> status has been updated.
</p>


<h3>Order Details</h3>

<p>
Previous Status:
<b>${data.oldStatus}</b>
</p>

<p>
New Status:
<b>${data.newStatus}</b>
</p>


<p>
Updated Date:
${new Date().toLocaleString()}
</p>


<p>
Thank you,<br>
Bookstore Team
</p>

`;


await sendEmail({

to:data.email,

subject:`Order #${data.orderId} Status Updated`,

html

});


};
module.exports = {

sendEmail,

sendRefundEmail,

sendOrderStatusEmail

};
