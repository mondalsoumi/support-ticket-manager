const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/analytics/summary
router.get('/summary', protect, isAdmin, async (req, res) => {
    try {

        // 1. Total ticket count — simplest aggregation
        const total = await Ticket.countDocuments();

        // 2. Count tickets grouped by status
        const byStatus = await Ticket.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 3. Count tickets grouped by category
        const byCategory = await Ticket.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // 4. Count tickets grouped by priority
        const byPriority = await Ticket.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // 5. Tickets created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentCount = await Ticket.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            total,
            recentCount,
            byStatus,
            byCategory,
            byPriority
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;