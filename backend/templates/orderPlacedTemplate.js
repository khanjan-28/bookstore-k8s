module.exports = ({
  customerName,
  orderId,
  total,
  paymentMethod,
  orderDate,
  books
}) => {
const rows = books.map(book => `
<tr>
  <td>${book.title}</td>
  <td>${book.quantity}</td>
  <td>Rs. ${Number(book.price).toFixed(2)}</td>
</tr>
`).join("");
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
  </head>
  <body style="font-family:Arial;background:#f5f5f5;padding:30px;">

      <div style="max-width:600px;background:#fff;margin:auto;border-radius:10px;padding:30px;">

          <h1 style="color:#2563eb;">
              📚 BOOKSTORE
          </h1>

          <h3>Hello ${customerName},</h3>

          <p>
              Your order has been placed successfully.
          </p>

<h3>Order Details</h3>

<p><b>Order ID:</b> #${orderId}</p>

<p><b>Order Date:</b> ${new Date(orderDate).toLocaleDateString()}</p>

<p><b>Payment Method:</b> ${paymentMethod}</p>

<table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse:collapse;">

<tr style="background:#2563eb;color:white;">
<th>Book</th>
<th>Qty</th>
<th>Price</th>
</tr>

${rows}

</table>

<br>

<h2 style="color:#16a34a;">
Grand Total : Rs. ${Number(total).toFixed(2)}
</h2>
          <br>

          <p>
              Thank you for shopping with us ❤️
          </p>

      </div>

  </body>
  </html>
  `;
};
