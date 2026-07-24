import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {

  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.text("ONLINE BOOK STORE", 20, 20);

  doc.setFontSize(15);
doc.text("PREMIUM INVOICE TEST 123", 20, 32);

  // Company Details
  doc.setFontSize(11);

  doc.text(
    "Address: Ahmedabad, Gujarat, India",
    20,
    45
  );

  doc.text(
    "Email: support@onlinebookstore.com",
    20,
    52
  );


  // Invoice Info
  doc.text(
    `Invoice No: ${order.id}`,
    140,
    45
  );


  doc.text(
    `Date: ${new Date(order.created_at).toLocaleDateString()}`,
    140,
    52
  );


  // Customer Details
  doc.setFontSize(14);

  doc.text(
    "Customer Details",
    20,
    75
  );

  doc.setFontSize(11);

  doc.text(
    `Name: ${order.full_name || "Customer"}`,
    20,
    88
  );

  doc.text(
    `Phone: ${order.phone || "-"}`,
    20,
    95
  );

  doc.text(
    `Address: ${order.address || "-"}`,
    20,
    102
  );


  // Items Table
  autoTable(doc, {

    startY:120,

    head:[
      [
        "Book",
        "Quantity",
        "Price",
        "Total"
      ]
    ],

    body:[
      [
        "Order Items",
        "-",
        "-",
        `Rs.${order.total_price}`
      ]
    ]

  });


  const finalY = doc.lastAutoTable.finalY + 15;


  // Total
  doc.setFontSize(14);

  doc.text(
    `Grand Total: Rs.${order.total_price}`,
    20,
    finalY
  );


  // Payment
  doc.setFontSize(12);

  doc.text(
    `Payment Method: ${order.payment_method || "COD"}`,
    20,
    finalY + 15
  );


  doc.text(
    "Thank you for shopping with Online Book Store!",
    20,
    finalY + 30
  );


  doc.save(
    `Invoice-${order.id}.pdf`
  );

};


export default generateInvoice;
