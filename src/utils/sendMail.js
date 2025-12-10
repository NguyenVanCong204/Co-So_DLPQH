import nodemailer from "nodemailer";

const sendMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "d7e90df0404e79",
                pass: "25b649db1c088c"
            }
        });

        const info = await transporter.sendMail({
            from: '"HKDN E-commerce" <no-reply@hkdn.com>',
            to,
            subject,
            text,
            html
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default sendMail;
