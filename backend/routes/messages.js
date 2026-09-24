import express from 'express';
import Message from '../models/Message.js';
import protect from '../middleware/auth.js';
import { sendEmail } from '../config/mailer.js';

const router = express.Router();

const mapMessage = (doc) => {
  if (!doc) return null;
  const m = doc.toObject ? doc.toObject() : doc;
  return { ...m, _id: m._id, id: m._id, createdAt: m.createdAt };
};

// @desc    Submit a contact message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const newMessage = await Message.create({
      name,
      email: email.toLowerCase().trim(),
      subject: subject || 'General Inquiry',
      message
    });

    const savedMessage = mapMessage(newMessage);

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'donboscop24@gmail.com';
    sendEmail({
      to: adminEmail,
      subject: `New Portfolio Message: ${subject || 'No Subject'}`,
      text: `You have received a new contact message.\n\nFrom: ${name} (${email})\nSubject: ${subject || 'No Subject'}\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 100px;">From:</td>
              <td style="padding: 6px 0;">${name} (&lt;${email}&gt;)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 6px 0;">${subject || 'No Subject'}</td>
            </tr>
          </table>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 16px; font-style: italic; white-space: pre-line;">
            ${message}
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">Sent from your Developer Portfolio Website</p>
        </div>
      `
    }).catch(err => console.error('Email send failed:', err.message));

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages.map(mapMessage));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
