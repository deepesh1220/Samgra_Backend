const nodemailer = require('nodemailer');
const config = require('../config/config');
require('dotenv').config();
const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Deepesh Sahu" <deepeshsahu229@gmail.com>',
    to: email,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmail;



