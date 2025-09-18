import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: CONFIG.mail.host,
  port: CONFIG.mail.port,
  secure: true,
  auth: {
    user: CONFIG.mail.user,
    pass: CONFIG.mail.pass,
  },
});

export default transporter