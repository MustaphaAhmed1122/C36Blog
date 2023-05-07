const nodemailer = require("nodemailer");

async function sendEmail(dest, message, attachment) {
  let attach = [];
  if (attach) {
    attach = attachment;
  }
  let transporter = nodemailer.createTransport({
    port: 587 || 50000,
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SenderMail, // generated ethereal user
      pass: process.env.SenderPassword, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Fred Foo 👻" <${process.env.SenderMail}>`, // sender address
    to: dest, // list of receivers
    subject: "Confirmation Mail ✔", // Subject line
    attachments: attach,
    text: "confirm your mail", // plain text body
    html: message, // html body
  });
}

module.exports = sendEmail;
