const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, securityQuestion, securityAnswer } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedAnswer
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Issue token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// GET /api/auth/security-question?email=...
// Step 1 of reset: fetch the question for a given email
router.get('/security-question', async (req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        res.json({ securityQuestion: user.securityQuestion });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/verify-security-answer
// Step 2 of reset: check the answer, issue a short-lived reset token
router.post('/verify-security-answer', async (req, res) => {
    try {
        const { email, securityAnswer } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const isMatch = await bcrypt.compare(
            securityAnswer.toLowerCase().trim(),
            user.securityAnswer
        );

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect answer' });
        }

        // Short-lived token, ONLY usable for resetting password
        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.json({ resetToken });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/reset-password
// Step 3 of reset: use the reset token to set a new password
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Reset link expired or invalid. Please start again.' });
        }

        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        res.json({ message: 'Password reset successful. You can now log in.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;