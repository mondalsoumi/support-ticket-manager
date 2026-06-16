const express = require('express');
const router = express.Router({ mergeParams: true }); // ← important
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// POST /api/tickets/:id/comments — add a comment
router.post('/', protect, async (req, res) => {
    try {
        const comment = await Comment.create({
            ticket: req.params.id,
            author: req.user._id,
            message: req.body.message
        });

        const populated = await comment.populate('author', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/tickets/:id/comments — get all comments for a ticket
router.get('/', protect, async (req, res) => {
    try {
        const comments = await Comment.find({ ticket: req.params.id })
            .populate('author', 'name email')
            .sort({ createdAt: 1 }); // oldest first — conversation order

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;