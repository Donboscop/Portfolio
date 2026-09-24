import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  credentialId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  verifyUrl: {
    type: String,
    trim: true,
    default: ''
  },
  pdfUrl: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['practical', 'linkedIn'],
    default: 'practical'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
