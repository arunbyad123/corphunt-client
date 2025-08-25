const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // for SSL
  secure: true, // true for 465, false for 587
  auth: {
    user: "corphuntofficial@gmail.com", // your Gmail address
    pass: "ffnhlhrxuuqecrvv",   // your 16-char Google app password
  },
});

module.exports = transporter;
