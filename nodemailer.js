import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP Connection Verified: Ready to send emails.");

    await transporter.sendMail({
      from: `"PIXELPERL Booking" <${process.env.HOSTINGER_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err.message);
  }
};