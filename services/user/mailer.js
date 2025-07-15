const nodemailer = require("nodemailer");
const EventEmitter = require("events");
require("dotenv").config({ path: "../../.env" });

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

const sendEmail = new EventEmitter();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass
  }
});

sendEmail.on("sendInviteEmail", async (to, name) => {
  const signupLink = `http://localhost:3000/auth/signup?email=${encodeURIComponent(to)}`;
  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>You have been added to learning system.</p>
    <p>Please click the link below to set up your account:</p>
    <p><a href="${signupLink}">${signupLink}</a></p>
    <p>Best regards,<br/>System Admin</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: "Invitation to set up your student account",
      html
    });
    console.log("Invite email sent to:", to);
  } catch (err) {
    console.error("Failed to send invite email:", err.message);
  }
});

module.exports = { sendEmail };
