import express from 'express';
import Stats from '../models/Stats.js';

const router = express.Router();

// @desc    Get visitor count
// @route   GET /api/stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    let stats = await Stats.findOne({});
    if (!stats) {
      stats = await Stats.create({ count: 0 });
    }
    res.json({ count: stats.count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Increment visitor count
// @route   POST /api/stats/increment
// @access  Public
router.post('/increment', async (req, res) => {
  try {
    let stats = await Stats.findOne({});
    if (!stats) {
      stats = await Stats.create({ count: 1 });
    } else {
      stats.count += 1;
      await stats.save();
    }
    res.json({ count: stats.count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
