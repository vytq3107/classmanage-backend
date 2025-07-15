const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });
const username = process.env.MAIL_USER;
const password = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:username,
    pass:password
  }
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html
  });
}

module.exports = { sendEmail };
