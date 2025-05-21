import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE || false,
            service: process.env.SMTP_SERVICE || 'gmail',
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: true // for self-signed certificates
            }
        });

        const mailOptions = {
            from: `"ShopNest" <${process.env.SMTP_MAIL}>`,
            to: options.email,
            subject: options.subject || 'ShopNest Notification',
            text: options.text || '',
            html: options.html || options.message
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export default sendEmail
