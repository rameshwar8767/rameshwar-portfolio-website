import express from 'express';
import { protect } from '../middleware/auth.js';
import Experience from '../models/Experience.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
    const query = isAdmin ? {} : { status: 'Published' };
    const experiences = await Experience.find(query).sort({ order: 1, startDate: -1 });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
