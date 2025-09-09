const transporter = require("../config/nodemailer");

async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"CorpHunt" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendMail };
