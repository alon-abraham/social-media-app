import nodemailer from 'nodemailer';

export const sendFollowNotification = async (recipientEmail, senderUsername) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'New Follower Alert!',
      text: `${senderUsername} has followed you.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
