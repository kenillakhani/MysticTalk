import nodemailer from 'nodemailer';
import { generateVerificationEmail } from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your app-specific password
  },
});

// Function to send verification email
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Generate the HTML content
    const htmlContent = generateVerificationEmail(username, verifyCode);

    // Set up email data
    const mailOptions = {
      from: `"Mystery Message" <${process.env.EMAIL_USERNAME}>`, // Sender address with a display name
      to: email, // Recipient's email address
      subject: 'Mystery Message Verification Code', // Subject line
      html: htmlContent, // HTML body content
    };

    // Send email using the transporter
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);

    return {
      success: false,
      message: `Failed to send verification email. Error: ${(emailError as Error).message}`,
    };
  }
}
