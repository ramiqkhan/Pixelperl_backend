import express from 'express';
import { sendEmail } from '../nodemailer.js'; // <-- Updated path

const router = express.Router();

router.get('/test-email', async (req, res) => {
  try {
    const testRecipient = process.env.HOSTINGER_EMAIL;

    await sendEmail({
      to: testRecipient,
      subject: 'Hostinger SMTP Diagnostic Test',
      html: '<h3>Success!</h3><p>Your Hostinger SMTP server and Nodemailer configuration are working properly.</p>',
    });

    res.status(200).json({
      success: true,
      message: `Test email dispatched to ${testRecipient}. Check your inbox or terminal logs.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed.',
      error: error.message,
    });
  }
});

export default router;