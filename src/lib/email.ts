'use server';

import * as SibApiV3Sdk from '@sendinblue/client';

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

if (process.env.BREVO_API_KEY) {
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

const FROM_EMAIL = 'support@beautifulsoupandfood.com';
const FROM_NAME = 'BeautifulSoup&Food';

type EmailData = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(data: EmailData) {
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not set. Email not sent.');
    // For UI testing, simulate success even if the key is missing.
    return { success: true, message: 'Email sending is disabled (missing API key).' };
  }

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = data.subject;
  sendSmtpEmail.htmlContent = data.html;
  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: data.to }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error: any) {
    console.error('Error sending email with Brevo:', error);
    return { success: false, message: 'Failed to send email.' };
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const subject = 'Reset Your Password for BeautifulSoup&Food';
  const html = `
    <p>Hello,</p>
    <p>You requested a password reset for your BeautifulSoup&Food account.</p>
    <p>Please click the link below to set a new password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thanks,<br>The BeautifulSoup&Food Team</p>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendWelcomeEmail(to: string, name: string) {
    const subject = 'Welcome to BeautifulSoup&Food!';
    const html = `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for signing up at BeautifulSoup&Food. We're excited to have you.</p>
        <p>Explore our shop to discover the finest selection of gourmet produce, artisan goods, and more.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/shop">Start Shopping</a>
        <p>Best,<br>The BeautifulSoup&Food Team</p>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendEmailVerification(to: string, verificationLink: string) {
    const subject = 'Verify Your Email Address';
    const html = `
        <p>Hello,</p>
        <p>Please verify your email address to complete your registration with BeautifulSoup&Food.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link is valid for 1 hour.</p>
        <p>Thanks,<br>The BeautifulSoup&Food Team</p>
    `;

    return sendEmail({to, subject, html});
}
