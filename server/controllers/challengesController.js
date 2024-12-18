const achievementModel = require("../models/achievementModel");
const challengesModel = require("../models/challengesModel");

//create challnege API 
createChallenge = async (req, res) => {
    try {
        const { title, description, aura_points, end_date } = req.body;

        const newChallenge = new challengesModel({ title, description, aura_points, end_date });

        await newChallenge.save();
        res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// updateChallenge API
updateChallenge = async (req, res) => {
    try {
        const { challenge_id, title, description, aura_points, end_date } = req.body;

        const challenge = await challengesModel.findById({_id:challenge_id});

        if (!challenge)
            return res.status(404).json({ message: 'Challenge not found' });

        /*
        // only the coordinator (creator) can update the challenge
        if (challenge.creator_id.toString() !== req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to update this challenge' });
        }
        */

        challenge.title = title || challenge.title;
        challenge.description = description || challenge.description;
        challenge.aura_points = aura_points || challenge.aura_points;
        challenge.end_date = end_date || challenge.end_date;

        await challenge.save();
        res.status(200).json({ message: 'Challenge updated successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// propose Challenge API
proposeChallenge = async (req, res) => {
    try {
        const { title, description, aura_points, end_date, invitedUsers,isPublic } = req.body;
        const creator_id = req.user._id;  

        const newChallenge = new challengesModel({title, description,creator_id,aura_points,end_date,invitedUsers,isPublic});

        await newChallenge.save();

        res.status(201).json({ message: 'Challenge proposed successfully', challenge: newChallenge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// invite others to challenge API 
inviteOthers = async (req, res) => {
    try {
        const { challenge_id,invitee_id} = req.body;

        const challenge = await challengesModel.findById( { _id : challenge_id });

        if (!challenge) 
            return res.status(404).json({ message: 'Challenge not found' });

        
        const isUserInvited = challenge.invitedUsers.some(invite => invite.invitee_id.toString() === invitee_id);
        if (isUserInvited) 
            return res.status(400).json({ message: 'User is already invited' });
        
        challenge.invitedUsers.push({ invitee_id: invitee_id});

        await challenge.save();

        res.status(200).json({ message: 'User invited successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//accept the propose challenge
acceptChallenge = async (req, res) => {
    try {
        const { challenge_id } = req.body;
        
        const challenge = await challengesModel.findById({_id:challenge_id});
        if (!challenge) 
            return res.status(404).json({ message: 'Challenge not found' });

        if(!challenge.isPublic){
            const invitedUser = challenge.invitedUsers.find(user => (user.invitee_id).toString() === req.user._id);
            if (!invitedUser) {
                return res.status(400).json({ message: 'You have already accepted this challenge or were not invited' });
            }
            challenge.invitedUsers = challenge.invitedUsers.filter((i) = i.invitee_id !== req.user._id);
        }

        challenge.participants.push({ user: req.user._id, status: 'in-progress' });

        await challenge.save();

        res.status(200).json({ message: 'Challenge accepted successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



getChallenges = async (req, res) => {
    try {
        
        const challenges = await challengesModel.find({
            $or: [
                { 'participants.user': req.user._id } ,
                {'isPublic':true}  
            ]
        });

        res.status(200).json({message:"All challenges returned.", challenges });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

markComplete = async (req, res) => {
    try {
        const { challenge_id } = req.body;

        const challenge = await challengesModel.findById({_id:challenge_id});

        if (!challenge) 
            return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenge.participants.find( (p )=>{ return ((p.user).toString() === req.user._id);});

        if (!participant || participant.status !== 'in-progress') {
            return res.status(400).json({ message: 'Challenge not in progress' });
        }

        // Mark as completed
        participant.status = 'completed';
        participant.completionDate = new Date();

        
        // add to achievements
        const achievement = await achievementModel.findOne({ user: req.user._id }) 
                                || new achievementModel({ user: req.user._id, achievements: [] });

        const description =`Completed the ${challenge.title} challenge.`;
        achievement.achievements.push({
            challenge_id: challenge._id,
            description: description,
            aura_points: challenge.aura_points,
            completionDate: new Date(),
        });

        await achievement.save();
        await challenge.save();
        
        res.status(200).json({ message: 'Challenge marked as completed and added to achievements' });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//delete challnge API
deleteChallenge = async (req, res) => {
    try {
        const { challenge_id } = req.body;

        // find the challenge by ID
        const challenge = await challengesModel.findById({ _id: challenge_id });
        if (!challenge) 
            return res.status(404).json({ message: 'Challenge not found' });

        /*
            // check if the user is the creator of the challenge
            if (challenge.creator_id !== req.user._id) {
                return res.status(403).json({ message: 'You are not authorized to delete this challenge' });
            }
        */

        // delete the challenge
        await challengesModel.deleteOne({ _id: challenge_id });

        res.status(200).json({ message: 'Challenge deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports= {
    createChallenge, updateChallenge, proposeChallenge, inviteOthers, acceptChallenge,
    getChallenges, markComplete, deleteChallenge
};