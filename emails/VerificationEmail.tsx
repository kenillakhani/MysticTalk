import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

// emails/VerificationEmail.ts
export function generateVerificationEmail(username: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
      <style>
        /* Add your styles here */
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .code { font-weight: bold; font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <p class="code">${otp}</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

