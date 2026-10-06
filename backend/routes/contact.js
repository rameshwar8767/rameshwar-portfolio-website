import express from 'express';
import { protect } from '../middleware/auth.js';
import Contact from '../models/Contact.js';

const router = express.Router();

// @route POST /api/v1/contact
// @desc Public route to submit a message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route GET /api/v1/contact
// @desc Admin route to view all messages
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route DELETE /api/v1/contact/:id
// @desc Admin route to delete a message
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route PUT /api/v1/contact/:id
// @desc Admin route to mark message as read/unread
router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    
    contact.read = req.body.read !== undefined ? req.body.read : true;
    await contact.save();
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
