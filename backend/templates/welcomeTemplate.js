module.exports = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family:Arial;background:#f5f5f5;padding:30px;">

    <div style="max-width:600px;background:#fff;margin:auto;padding:30px;border-radius:10px;">

      <h1 style="color:#2563eb;">📚 Welcome to BOOKSTORE</h1>

      <h2>Hello ${name}, 👋</h2>

      <p>
        Your account has been created successfully.
      </p>

      <p>
        You can now login and start purchasing your favourite books.
      </p>

      <div style="margin:30px 0;">
        <a
          href="http://YOUR_FRONTEND_URL/login"
          style="
            background:#2563eb;
            color:white;
            text-decoration:none;
            padding:12px 25px;
            border-radius:5px;
            display:inline-block;
          "
        >
          Login Now
        </a>
      </div>

      <hr>

      <p>
        Thank you for joining BookStore ❤️
      </p>

    </div>

  </body>
  </html>
  `;
};
