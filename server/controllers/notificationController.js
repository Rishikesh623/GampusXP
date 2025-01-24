const courseModel = require('../models/courseModel');
const notificationModel = require('../models/notificationModel');


// get course API - coordinator only
const getNotifications = async (req, res) => {
    try {

        //fetch all notifications of user 
        let notificationsDoc = await notificationModel.findOne({ user_id: req.user._id });


        if (!notificationsDoc) {
            notificationsDoc = new notificationModel({ user_id: req.user._id, notifications: [] });
            await notificationsDoc.save();

        }

        res.status(201).json({ notifications: notificationsDoc.notifications });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// add notification API - coordinator only
const addNotification = async (req, res) => {
    try {
        const { user_id, title, message } = req.body;

        const notification = await notificationModel.findOneAndUpdate({ user_id: user_id }, { $push: { notifications: { title, message } } });

        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markRead = async (req, res) => {
    try {
        console.log(req.body)
        const { notificationId } = req.body;

        const notification = await notificationModel.updateOne({ user_id: re.user._id, "notifications._id": notificationId },
            { $set: { "notifications.$.isRead": "true" } });

        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
}

module.exports = { getNotifications, addNotification, markRead };