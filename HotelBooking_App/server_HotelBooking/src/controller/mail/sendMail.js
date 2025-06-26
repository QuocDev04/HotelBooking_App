import 'dotenv/config';
import nodemailer from 'nodemailer';

const sendMail = async ({ email, subject, html }) => {
    // Validate input parameters
    if (!email || !subject || !html) {
        throw new Error('Missing required parameters: email, subject, and html are required');
    }

    let transporter;
    try {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            auth: {
                user: process.env.Mail_User,
                pass: process.env.Mail_Pass,
            },
        });

        const message = {
            from: process.env.Mail_User,
            to: email,
            subject: subject,
            html: html,
        };

        const result = await transporter.sendMail(message);
        return result;
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    } finally {
        if (transporter) {
            transporter.close();
        }
    }
};

export { sendMail };
