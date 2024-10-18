import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using the SendGrid API
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net', // Use SendGrid SMTP server
    port: 587, // Standard SMTP port
    secure: false, // Use TLS
    auth: {
        user: 'apikey', // This must be the string "apikey"
        pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
    },
});

// Utility function to send reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const mailOptions = {
            from: '"EMS System Support" amjadalijamali41@gmail.com',   
            to: email,   
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the link below to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>`,
            mail_settings: {
                sandbox_mode: {
                    enable: true  
                }
            }
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

export { sendPasswordResetEmail };
