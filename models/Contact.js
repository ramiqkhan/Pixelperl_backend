import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Work email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: '',
      maxlength: 150,
    },

    topicOfInquiry: {
      type: String,
      required: true,
      enum: [
        'General Inquiry',
        'Enterprise Architecture',
        'Security & Compliance',
        'Technical Support',
        'Partnership Opportunity',
      ],
      default: 'General Inquiry',
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 2000,
    },

    ticketId: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'New',
        'Read',
        'In Progress',
        'Resolved',
        'Archived',
      ],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;