import nodemailer from 'nodemailer';

// Function to send email notifications
export const sendEmailNotification = async (recipientEmail, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,   // Your email address
        pass: process.env.EMAIL_PASS,   // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
