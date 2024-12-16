const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievements: [
        {
            challenge_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Challenge',
                required: true
            },
            description:String,
            aura_points: {
                type: Number,
                required: true
            },
            completionDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
});

const achievementModel = mongoose.model('Achievement', achievementSchema);

module.exports = achievementModel;
