import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);
