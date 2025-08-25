const transporter = require("../utils/email");

async function sendSignupMail(toEmail) {
  try {
    const info = await transporter.sendMail({
      from: `"CorpHunt" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to CorpHunt",
      text: "Thanks for signing up!",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

module.exports = { sendSignupMail };
