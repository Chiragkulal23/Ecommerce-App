const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: email === "admin@example.com" ? "admin" : "user",
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special check for hardcoded admin
    if (email === 'admin@example.com' || email === 'admin@styleaura.com') {
      if (password === 'admin@123' || password === 'admin123') { // Added common password variations
        // Create a token for the admin
        const token = jwt.sign(
          { email, id: 'admin_id', role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.status(200).json({
          result: { email, role: 'admin', name: 'Admin' },
          admin: { email, role: 'admin', name: 'Admin' }, // For Admin App
          token
        });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: user, admin: user, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;

