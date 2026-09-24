import express from 'express';
import Milestone from '../models/Milestone.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const mapMilestone = (doc) => {
  if (!doc) return null;
  const m = doc.toObject ? doc.toObject() : doc;
  return { ...m, _id: m._id, id: m._id };
};

// @desc    Get all milestones
// @route   GET /api/milestones
// @access  Public
router.get('/', async (req, res) => {
  try {
    const milestones = await Milestone.find({}).sort({ year: -1 });
    res.json(milestones.map(mapMilestone));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new milestone
// @route   POST /api/milestones
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { year, title, company, description } = req.body;

  if (!year || !title || !description) {
    return res.status(400).json({ message: 'Year, title, and description are required' });
  }

  try {
    const newMilestone = await Milestone.create({
      year,
      title,
      company: company || '',
      description
    });
    res.status(201).json(mapMilestone(newMilestone));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { year, title, company, description } = req.body;

  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    if (year !== undefined) milestone.year = year;
    if (title !== undefined) milestone.title = title;
    if (company !== undefined) milestone.company = company;
    if (description !== undefined) milestone.description = description;

    const updatedMilestone = await milestone.save();
    res.json(mapMilestone(updatedMilestone));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
