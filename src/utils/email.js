const nodemailer = require('nodemailer');
const result = require('./result');

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return result(0, 'success', { message: `Email sent: ${info.response}` });
    } catch (error) {
        return result(1, 'failed', { message: `Failed to send email: ${error.message}` });
    }
};

module.exports = sendEmail;

