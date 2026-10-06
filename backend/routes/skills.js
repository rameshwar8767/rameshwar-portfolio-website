import express from 'express';
import { protect } from '../middleware/auth.js';
import Skill from '../models/Skill.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
    const query = isAdmin ? {} : { status: 'Published' };
    const skills = await Skill.find(query).sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
