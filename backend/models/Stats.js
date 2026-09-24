import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;
