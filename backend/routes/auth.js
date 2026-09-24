import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import { sendEmail } from '../config/mailer.js';
import createUploader, { getFileUrl } from '../config/s3.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Generate & send OTP to admin email
// @route   POST /api/auth/otp/send
// @access  Public
router.post('/otp/send', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    // If user does not exist yet, auto-create as Admin
    if (!user) {
      user = await User.create({
        email: email.toLowerCase().trim(),
        password: 'UnrealPlaceholderPasswordForOTPUser'
      });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to MongoDB
    user.otp = generatedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Print clear console log banner for developer
    console.log('\n======================================================');
    console.log(`🔑 ADMIN OTP CODE FOR ${email}: [ ${generatedOtp} ]`);
    console.log('======================================================\n');

    // Attempt email delivery via mailer
    let mailResult = { fallback: true };
    try {
      mailResult = await sendEmail({
        to: email,
        subject: 'Your Admin Dashboard OTP Code',
        text: `Your OTP is: ${generatedOtp}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; color: #1e293b;">
            <h2 style="color: #8b5cf6; text-align: center; margin-bottom: 24px;">Secure Verification Code</h2>
            <p style="font-size: 15px;">Hello Don Bosco,</p>
            <p style="font-size: 15px;">Your verification code to access the Admin Dashboard is:</p>
            <div style="text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background-color: #f3e8ff; border: 1px dashed #a855f7; border-radius: 8px; color: #7e22ce;">${generatedOtp}</span>
            </div>
            <p style="font-size: 13px; color: #64748b;">This code is valid for 10 minutes.</p>
          </div>
        `
      });
    } catch (err) {
      console.warn('Mailer notification warning:', err.message);
    }

    res.json({ 
      success: true, 
      otp: generatedOtp,
      message: mailResult.fallback 
        ? 'Verification code generated! Check your email or terminal log.' 
        : 'Verification code sent directly to your email inbox!' 
    });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: error.message || 'OTP generation error' });
  }
});

// @desc    Verify OTP code & return JWT token
// @route   POST /api/auth/otp/verify
// @access  Public
router.post('/otp/verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const inputOtp = String(otp).trim();
    const storedOtp = user.otp ? String(user.otp).trim() : '';

    // Check if OTP matches and is not expired
    if (!storedOtp || storedOtp !== inputOtp || !user.otpExpires || new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Clear OTP after successful verification
    user.otp = '';
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET || 'developer_portfolio_secret_key_987654321',
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ message: error.message || 'Verification error' });
  }
});

// @desc    Verify if token is active
// @route   GET /api/auth/verify
// @access  Protected
router.get('/verify', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ valid: true, user: { ...user.toObject(), _id: user._id, profilePic: user.profilePic } });
    } else {
      res.status(404).json({ valid: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

// @desc    Get admin profile publicly
// @route   GET /api/auth/admin-profile
// @access  Public
router.get('/admin-profile', async (req, res) => {
  try {
    const user = await User.findOne({});
    if (user) {
      res.json({ email: user.email, profilePic: user.profilePic, _id: user._id });
    } else {
      res.status(404).json({ message: 'Admin user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const upload = createUploader({ maxFileSize: 5 * 1024 * 1024 });

// @desc    Upload / Update admin profile picture
// @route   POST /api/auth/profile-pic
// @access  Private/Admin
router.post('/profile-pic', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Profile image is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Admin user not found' });
    }

    if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), user.profilePic.substring(1));
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error('Failed to delete old profile pic:', err.message);
        }
      }
    }

    const newProfilePic = getFileUrl(req.file);
    user.profilePic = newProfilePic;
    await user.save();

    res.json({ success: true, profilePic: newProfilePic });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed cleanup of failed upload:', err.message);
      }
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
