const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    aura_points: Number, 
    end_date: Date, 
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: {
                type: String,
                enum: ['pending', 'completed', 'in-progress'],
                default: 'pending' // Pending, in-progress, or completed
            },
            completionDate: Date,
        }
    ],
    isPublic: { type: Boolean, default: true }, // If open to all users or not
    invitedUsers: [
        {
            invitee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

const challengesModel = mongoose.model('Challenge', challengeSchema);

module.exports = challengesModel;
