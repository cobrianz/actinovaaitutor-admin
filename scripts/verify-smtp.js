const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function verifySmtp() {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    console.log(`Testing SMTP: ${smtpHost}:${smtpPort} as ${smtpUser}`);

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP Connection Successful!");
        process.exit(0);
    } catch (error) {
        console.error("❌ SMTP Connection Failed:", error);
        process.exit(1);
    }
}

verifySmtp();
