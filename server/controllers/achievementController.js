const achievementModel = require("../models/achievementModel");


// Get all achievements API
getAchievements = async (req, res) => {
  try {
    const achievements = await achievementModel.findOne({ user: user.req._id }).select('achievements');

    if (!achievements) {
      return res.status(404).json({ message: 'No achievemenets yet.' });
    }

    res.status(200).json({ achievements: achievements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAchievements };