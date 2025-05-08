const nodemailer = require("nodemailer");
// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ac40ea54da2457",
      pass: "3a737e941c432e"
    }
  });
module.exports = transport;