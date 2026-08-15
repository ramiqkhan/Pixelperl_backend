import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  businessType: {
    type: String,
    required: true,
    enum: [
      'Retail Store',
      'Construction Site',
      'Warehouse',
      'Commercial Office',
      'Other'
    ],
    default: 'Retail Store'
  },
  locationCount: {
    type: String,
    required: true,
    enum: [
      '1 Site',
      '1-3 Sites',
      '4-10 Sites',
      '10+ Sites'
    ],
    default: '1-3 Sites'
  },
  contractDuration: {
    type: String,
    required: true,
    enum: [
      '12 Months',
      '24 Months',
      'Short-term Project'
    ],
    default: '12 Months'
  },
  urgency: {
    type: String,
    required: true,
    enum: [
      'Immediate',
      'Standard',
      'Planning Phase'
    ],
    default: 'Standard'
  },
  servicesNeeded: {
    type: [String],
    enum: [
      'retail',
      'construction',
      'remote',
      'rdv_hardware',
      'analytics'
    ],
    default: []
  },
  projectDetails: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Work email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'In Progress', 'Completed', 'Archived'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;