import Quote from '../models/Quote.js';
import { sendEmail } from '../nodemailer.js';

const quoteController = {
  // @desc    Create a new quote request & dispatch email
  // @route   POST /api/quotes
  // @access  Public
  createQuote: async (req, res) => {
    try {
      const {
        businessType,
        locationCount,
        contractDuration,
        urgency,
        servicesNeeded,
        projectDetails,
        fullName,
        email,
        phone,
        companyName,
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !businessType) {
        return res.status(400).json({
          success: false,
          message: 'Please fill out all required contact and operation fields.',
        });
      }

      // Generate unique ticket ID matching frontend pattern (#PX-XXXXXX)
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `#PX-${randomDigits}`;

      const newQuote = await Quote.create({
        ticketId,
        businessType,
        locationCount,
        contractDuration,
        urgency,
        servicesNeeded,
        projectDetails,
        fullName,
        email,
        phone,
        companyName,
      });

      // --- DISPATCH NOTIFICATION EMAIL TO ADMIN ---
      try {
        const adminEmail = process.env.HOSTINGER_EMAIL;
        const formattedServices = Array.isArray(servicesNeeded) 
          ? servicesNeeded.join(', ') 
          : (servicesNeeded || 'None specified');

        await sendEmail({
          to: adminEmail,
          subject: `New Quote Request: ${ticketId} - ${companyName || fullName}`,
          html: `
            <h2>New Quote Submission Received</h2>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
            <hr />
            <h3>Client Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${fullName}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Company:</strong> ${companyName || 'N/A'}</li>
            </ul>
            <h3>Project Parameters:</h3>
            <ul>
              <li><strong>Business Type:</strong> ${businessType}</li>
              <li><strong>Locations:</strong> ${locationCount}</li>
              <li><strong>Contract Duration:</strong> ${contractDuration}</li>
              <li><strong>Urgency:</strong> ${urgency}</li>
              <li><strong>Services Needed:</strong> ${formattedServices}</li>
              <li><strong>Details:</strong> ${projectDetails || 'None provided'}</li>
            </ul>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr.message);
      }
      // ---------------------------------------------

      return res.status(201).json({
        success: true,
        message: 'Quote request submitted successfully.',
        data: {
          ticketId: newQuote.ticketId,
          id: newQuote._id,
        },
      });
    } catch (error) {
      console.error('Error creating quote:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while processing your request.',
        error: error.message,
      });
    }
  },
};

export default quoteController;