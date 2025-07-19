const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');
const notificationModel = require('../models/notificationModel');


// get notification
const getNotifications = async (req, res) => {
    try {

        //fetch all notifications of user 
        let notificationsDoc = await notificationModel.findOne({ user_id: req.user._id });

        if (!notificationsDoc) {
            notificationsDoc = new notificationModel({ user_id: req.user._id, notifications: [] });
            await notificationsDoc.save();
        }

        const reversedNotifications = [...notificationsDoc.notifications].reverse();

        res.status(200).json({ notifications: reversedNotifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// add notification API
const addNotification = async (req, res) => {
    try {
        const { user_id, title, message } = req.body;

        const notification = await notificationModel.findOneAndUpdate(
            { user_id: user_id },
            {
                $push: { notifications: { title, message } }
            },
            {
                upsert: true
            });

        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markRead = async (req, res) => {
    try {
        // console.log(req.body)
        const { notificationId } = req.body;

        const notification = await notificationModel.updateOne({ user_id: req.user._id, "notifications._id": notificationId },
            { $set: { "notifications.$.is_read": "true" } });

        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
}

const notifyCoordinator = async (req, res) => {
    try {
        const { oldRegNo, newRegNo, message } = req.body;

        const User = await userModel.findOne(
            { email: process.env.COORDINATOR_ID }
        ).select('_id');

        if (!User) {
            throw new Error('Coordinator not found');
        }
        const coordinatorId = User._id;


        const notification = await notificationModel.findOneAndUpdate(
            { user_id: coordinatorId },
            {
                $push: {
                    notifications: {
                        title: `User ${oldRegNo} requested a registration number change.`,
                        message: `New Registration Number: ${newRegNo}\nMessage: ${message || ''}`,
                        date: new Date() // Optional: add a timestamp
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        );


        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { getNotifications, addNotification, markRead, notifyCoordinator };