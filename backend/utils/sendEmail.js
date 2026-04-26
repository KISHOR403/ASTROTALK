const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        message: process.env.SMTP_PASS,
    },
});

const sendApprovalEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: '"AstroTalk" <noreply@astrotalk.com>',
            to: email,
            subject: 'Congratulations! Your account is approved',
            text: `Hello ${name}, Congratulations! Your AstroTalk astrologer account is approved. You can now login and start your consultations.`,
            html: `<b>Hello ${name},</b><br><br>Congratulations! Your AstroTalk astrologer account is approved. You can now login and start your consultations.`,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

const sendRejectionEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: '"AstroTalk" <noreply@astrotalk.com>',
            to: email,
            subject: 'Update on your AstroTalk application',
            text: `Hello ${name}, Your application was not approved. Contact support for more details.`,
            html: `<b>Hello ${name},</b><br><br>Your application was not approved. Contact support for more details.`,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

const sendReviewEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: '"AstroTalk" <noreply@astrotalk.com>',
            to: email,
            subject: 'Your application is under review',
            text: `Hello ${name}, Your application is under review. We'll notify you within 24 hours.`,
            html: `<b>Hello ${name},</b><br><br>Your application is under review. We'll notify you within 24 hours.`,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

const sendAdminNotification = async (astrologerName, astrologerEmail) => {
    try {
        await transporter.sendMail({
            from: '"AstroTalk" <noreply@astrotalk.com>',
            to: process.env.ADMIN_EMAIL || 'admin@astrotalk.com',
            subject: 'New Astrologer Application',
            text: `Hello Admin, A new astrologer application from ${astrologerName} (${astrologerEmail}) is pending review.`,
            html: `<b>Hello Admin,</b><br><br>A new astrologer application from ${astrologerName} (${astrologerEmail}) is pending review.`,
        });
    } catch (error) {
        console.error('Admin notification failed:', error);
    }
};

module.exports = {
    sendApprovalEmail,
    sendRejectionEmail,
    sendReviewEmail,
    sendAdminNotification
};

