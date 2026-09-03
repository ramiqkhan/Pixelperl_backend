import Contact from '../models/Contact.js';
import { sendEmail } from '../nodemailer.js';

const contactController = {
  // @desc    Create a new contact inquiry & dispatch email
  // @route   POST /api/contact
  // @access  Public
  createContact: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        company,
        service,
        message,
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !message) {
        return res.status(400).json({
          success: false,
          message: 'Please fill out all required fields.',
        });
      }

      // Generate unique ticket ID
      const randomDigits = Math.floor(
        100000 + Math.random() * 900000
      );

      const ticketId = `#CT-${randomDigits}`;

      // Create contact inquiry
      const newContact = await Contact.create({
        ticketId,
        fullName: name,
        email,
        phone,
        companyName: company,
        topicOfInquiry: service || 'General Inquiry',
        message,
      });

      // Send notification email to admin
      try {
        const adminEmail = process.env.HOSTINGER_EMAIL;

        await sendEmail({
          to: adminEmail,
          subject: `New Contact Inquiry: ${ticketId} - ${company || name}`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">

              <h2 style="color: #2563eb;">
                New Contact Inquiry Received
              </h2>

              <p>
                <strong>Ticket ID:</strong> ${ticketId}
              </p>

              <hr />

              <h3>Contact Details</h3>

              <ul>
                <li>
                  <strong>Name:</strong> ${name}
                </li>

                <li>
                  <strong>Email:</strong> ${email}
                </li>

                <li>
                  <strong>Phone:</strong> ${phone}
                </li>

                <li>
                  <strong>Company:</strong> ${
                    company || 'N/A'
                  }
                </li>
              </ul>

              <h3>Inquiry Details</h3>

              <ul>
                <li>
                  <strong>Topic:</strong> ${
                    service || 'General Inquiry'
                  }
                </li>

                <li>
                  <strong>Status:</strong> New
                </li>
              </ul>

              <h3>Message</h3>

              <div style="
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                white-space: pre-wrap;
              ">
                ${message}
              </div>

              <hr />

              <p>
                <strong>Ticket:</strong> ${ticketId}
              </p>

            </div>
          `,
        });

      } catch (emailErr) {
        // Don't fail the contact submission if email fails
        console.error(
          'Failed to send contact notification email:',
          emailErr.message
        );
      }

      return res.status(201).json({
        success: true,
        message: 'Your message has been submitted successfully.',
        data: {
          ticketId: newContact.ticketId,
          id: newContact._id,
        },
      });

    } catch (error) {
      console.error('Error creating contact inquiry:', error);

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: Object.values(error.errors).map(
            (err) => err.message
          ),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Server error while processing your request.',
        error: error.message,
      });
    }
  },
};

export default contactController;