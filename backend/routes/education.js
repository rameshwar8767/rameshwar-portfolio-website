import express from 'express';
import { protect } from '../middleware/auth.js';
import Education from '../models/Education.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
    const query = isAdmin ? {} : { status: 'Published' };
    const educations = await Education.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: educations });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!education) return res.status(404).json({ error: 'Education not found' });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ error: 'Education not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
