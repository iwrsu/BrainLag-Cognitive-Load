const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth'); // your JWT middleware
const router = express.Router();
const StudentData = require('../models/student_data');
// ✅ GET current user (auto-login verification)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ email: user.email, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'Fill all details' });

  const exists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (exists)
    return res.status(409).json({
      message: 'Username or Email already exists',
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hashedPassword });

  res.status(201).json({ message: 'Registration successful' });
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES } // e.g., '1d'
    );

    // Send both token and email to frontend
    res.json({
      token,
      email: user.email,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ message: 'If user exists, password reset available' });

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  res.json({ message: 'Password reset token generated', resetToken });
});

// ✅ RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: 'Token expired or invalid' });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ message: 'Password reset successful' });
});



router.get('/student-data', async (req, res) => {
  try {
    const { email, page = 1, limit = 5, date } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const skip = (page - 1) * limit;

    const query = { email };

    // 🟢 Optional date filter
    if (date) {
      const start = new Date(date + "T00:00:00.000Z");
      const end = new Date(date + "T23:59:59.999Z");
      query.created_at = { $gte: start, $lte: end };
    }

    const data = await StudentData.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await StudentData.countDocuments(query);

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
