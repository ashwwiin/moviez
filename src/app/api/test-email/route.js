// app/api/test-email/route.js
import nodemailer from "nodemailer";

export async function GET() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER, // 'apikey'
      pass: process.env.SMTP_PASS, // your SendGrid API key
    },
  });

  try {
    await transporter.sendMail({
      from: `"Moviez" <moviez258963@gmail.com>`, // use your verified sender email here
      to: "ashwinthamban999@gmail.com", // replace with the email you want to test
      subject: "Test Email",
      html: "<p>Hello! This is a test email from Moviez app.</p>",
    });

    return new Response("✅ Test email sent successfully");
  } catch (err) {
    console.error("Email send error:", err);
    return new Response("❌ Failed to send test email");
  }
}
