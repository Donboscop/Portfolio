import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to config directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Helper to determine if mail is fully configured
const isMailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const createTransporter = () => {
  if (isMailConfigured()) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
      },
    });
  }
  return null;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"Portfolio Portal" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@portfolio.dev'}>`,
    to,
    subject,
    text,
    html,
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to ${to}: ${info.messageId}`);
      return { success: true, info };
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  } else {
    console.log('\n======================================================');
    console.log('            [FALLBACK EMAIL LOGGING]');
    console.log(`  To:       ${to}`);
    console.log(`  Subject:  ${subject}`);
    console.log(`  Text:     ${text}`);
    console.log('======================================================\n');
    return { success: true, fallback: true };
  }
};
