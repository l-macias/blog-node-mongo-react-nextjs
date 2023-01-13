import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_TO,
        pass: process.env.GMAIL_KEY,
    },
    tls: {
        ciphers: "SSLv3",
    },
};
const transporter = createTransport(config);
export default transporter;
