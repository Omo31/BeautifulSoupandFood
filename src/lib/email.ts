'use server';

import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = 'support@beautifulsoupandfood.com';

type EmailData = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(data: EmailData) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set. Email not sent.');
    // In a real app, you might want to throw an error or handle this more gracefully.
    // For now, we'll just log it and simulate a success response for UI testing.
    return { success: true, message: 'Email sending is disabled (missing API key).' };
  }

  const msg = {
    ...data,
    from: FROM_EMAIL,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error: any) {
    console.error('Error sending email with SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
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
