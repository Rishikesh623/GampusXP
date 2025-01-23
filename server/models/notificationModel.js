const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notifications: [
        {
            title: {
                type: String,
                required: true
            },
            message: String,
            is_read: {
                type: Boolean,
                default:false
            },
            createdAt: {
                type: Date
            }
        }
    ]
});


const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = notificationModel;

