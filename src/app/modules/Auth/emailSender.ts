import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Next Dent" <tanimbinaziz145@gmail.com>',
    to: email,
    subject: "Reset Password Link",
    // text: "Hello world test email?", // plain‑text body
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

export default emailSender;
