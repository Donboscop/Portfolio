import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  githubLink: {
    type: String,
    trim: true,
    default: ''
  },
  liveLink: {
    type: String,
    trim: true,
    default: ''
  },
  images: [{
    type: String
  }],
  features: [{
    type: String,
    trim: true
  }],
  challengesFaced: {
    type: String,
    default: ''
  },
  learningOutcomes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
