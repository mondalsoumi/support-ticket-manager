const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect, isAdmin } = require('../middleware/auth');

// POST /api/tickets — create a ticket
const { classifyTicket } = require('../utils/aiClassifier');

router.post('/', protect, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Call Gemini to classify the ticket
        let aiData = {};
        try {
            aiData = await classifyTicket(title, description);
        } catch (aiError) {
            // AI failure must NOT stop ticket creation
            console.error('AI classification failed:', aiError.message);
        }

        const ticket = await Ticket.create({
            title,
            description,
            category: aiData.category || 'general',
            priority: aiData.priority || 'medium',
            aiSuggestedReply: aiData.aiSuggestedReply || '',
            aiClassifiedAt: aiData.category ? new Date() : null,
            createdBy: req.user._id
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// GET /api/tickets — always returns the logged-in user's OWN tickets
router.get('/', protect, async (req, res) => {
    try {
        const tickets = await Ticket.find({ createdBy: req.user._id })
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/tickets/all — admin/support only, returns EVERY ticket
router.get('/all', protect, isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// GET /api/tickets/:id — get a single ticket by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Optional: only allow the owner or admin to view it
        if (
            ticket.createdBy._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin' &&
            req.user.role !== 'support'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PATCH /api/tickets/:id — update ticket status or assignment
router.patch('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { status, assignedTo, priority } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status, assignedTo, priority },
            { new: true, runValidators: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;