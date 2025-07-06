const Activity = require('../models/activityModel');
const mongoose = require('mongoose');

const MAX_LOGS = 50;
const PAGE_LIMIT = 10;

const logActivity = async (userId, type, message) => {
    if (!userId || !type || !message) {
        throw {
            errorCode: 404,
            message: "Internal server error : activity with missing field"
        };
    }

    await Activity.create({ userId, type, message });

    const userLogs = await Activity.find({ userId }).sort({ createdAt: -1 });
    if (userLogs.length > MAX_LOGS) {
        const excess = userLogs.slice(MAX_LOGS);
        const excessIds = excess.map(log => log._id);
        await Activity.deleteMany({ _id: { $in: excessIds } });
    }
}

const getUserActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page || "1");

        const toskip = (page - 1) * PAGE_LIMIT;

        const activities =
            await Activity.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(toskip).limit(PAGE_LIMIT);

        if (!activities) {
            return res.status(404).json({ message: 'No activites yet.' });
        }

        const total = await Activity.countDocuments({ userId });

        res.status(200).json({ activities, total, page, pages: Math.ceil(total / PAGE_LIMIT) });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { logActivity, getUserActivity }

